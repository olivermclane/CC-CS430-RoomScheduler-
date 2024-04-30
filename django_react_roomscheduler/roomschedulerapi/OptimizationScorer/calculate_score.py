import numpy as np
import pandas as pd


def initialize_dataframe_processing(df):
    df['StartDateTime'] = pd.to_datetime(df['SEC_START_DATE'] + ' ' + df['MilitaryStart'], format='mixed')
    df['EndDateTime'] = pd.to_datetime(df['SEC_END_DATE'] + ' ' + df['MilitaryEnd'])
    df['ClassDuration'] = (df['EndDateTime'] - df['StartDateTime']).dt.total_seconds() / 3600
    return df


def calculate_prime_time_score(df, weights):
    prime_time_hours = list(range(8, 17))
    df['IsPrimeTime'] = df['StartDateTime'].dt.hour.isin(prime_time_hours).astype(int)
    df.sort_values(by=['CSM_BLDG', 'CSM_ROOM', 'StartDateTime'], inplace=True)
    df['OverlappingClasses'] = df.groupby(['CSM_BLDG', 'CSM_ROOM', 'StartDateTime'])['StartDateTime'].transform(
        'count') > 1
    df['PrimeTimeSingleCount'] = df.apply(lambda x: 1 if x['IsPrimeTime'] and not x['OverlappingClasses'] else 0,
                                          axis=1)
    prime_time_demand = df.groupby(['CSM_BLDG', 'CSM_ROOM'])['PrimeTimeSingleCount'].transform('sum')
    df['PrimeTimeUtilization'] = prime_time_demand
    df['PrimeTimeScore'] = df['PrimeTimeUtilization'] * weights['prime_time_score']
    return df


def adjust_score_by_capacity(utilization, ideal_min=0.6, ideal_max=0.9):
    if ideal_min <= utilization <= ideal_max:
        return 0
    else:
        deviation = min(abs(utilization - ideal_min), abs(utilization - ideal_max))
        return -deviation


def calculate_capacity_score(df, weights):
    df['CapacityUtilization'] = df['STUDENTS_AND_RESERVED_SEATS'] / df['SEC_CAPACITY']
    df['CapacityScore'] = df['CapacityUtilization'].apply(
        lambda x: adjust_score_by_capacity(x, ideal_min=0.6, ideal_max=0.9))
    df['CapacityScore'] *= weights['capacity_score']
    df['CapacityScore'].fillna(0, inplace=True)
    return df


def calculate_instructor_score(df, weights):
    instr_method_weights = {
        'CLIN': 2,  # CLIN is clincal courses
        'CLIN2': 2,  # CLIN is clincal courses
        'LAB': 2.5,  # LAB are labs courses
        'LEC': 1.0,  # LEC are lecture courses
        'SEM': 1.2,  # SEM are seminar courses
        'INTR': 1.3,  # INTR are internship courses
        'INDP': .2,  # INDP are independent courses
        'HON': 1.0,  # HON are honor courses
        'CYBER': .2,  # CYBER are online courses
        'HYBRD': .5,  # HYBRD are online/offline courses
        'FIELD': 1.3,  # FIELD are field courses?
        'RSRCH': 1.4,  # RSRCH are research courses
        'STCH': .2,  # STCH are student teaching
        'SA': 0,  # SA are study abroad courses
        'PRAC': .2,  # PRAC are practicum
        'REMOT': .2,  # REMOT are remote courses
    }

    # Convert each instructor method to its corresponding score, maintaining the original method for aggregation
    df['InstrMethodScore'] = df['CSM_INSTR_METHOD'].map(instr_method_weights).fillna(0)
    df['InstructorMethods'] = df['CSM_INSTR_METHOD']  # Keep original methods for aggregation

    # Group by building and classroom number, aggregate instruction methods into a list, and sum scores
    aggregated = df.groupby(['CSM_BLDG', 'CSM_ROOM']).agg({
        'InstructorMethods': lambda x: list(set(x)),  # Use set to remove duplicates
        'InstrMethodScore': 'sum'
    }).reset_index()

    # Now, calculate a score for each classroom. Adjust this calculation as necessary.
    aggregated['InstructorScore'] = aggregated['InstrMethodScore'] * weights['instructor_score']

    # Merge this aggregated data back with the original dataframe on building and classroom number
    # This ensures every row has the aggregated instructor methods and scores for its classroom
    df = df.merge(aggregated[['CSM_BLDG', 'CSM_ROOM', 'InstructorMethods', 'InstructorScore']],
                  on=['CSM_BLDG', 'CSM_ROOM'],
                  how='left',
                  suffixes=('', '_aggregated'))

    return df


def calculate_double_booking_score(df, weights):
    df['DoubleBookingPenalty'] = df['OverlappingClasses'].astype(int) * weights['double_booking_score']
    return df


def calculate_idle_time_and_score(df, weights):
    df['NextClassStart'] = df.groupby(['CSM_BLDG', 'CSM_ROOM'])['StartDateTime'].shift(-1)
    df['IdleTime'] = (df['NextClassStart'] - df['EndDateTime']).dt.total_seconds() / 3600
    df['IdleTime'].fillna(0, inplace=True)
    df['IdleTimeScore'] = df['IdleTime'] * weights['idle_time_score']
    return df


def calculate_overall_score(df):
    # Initially calculate the OverallScore for all rows
    df['OverallScore'] = df[
        ['PrimeTimeScore', 'CapacityScore', 'InstructorScore', 'DoubleBookingPenalty', 'IdleTimeScore']].sum(axis=1)

    # Exclude 'NoAssignment' rows for the normalization calculation
    df_not_no_assignment = df[~df['NoAssignment']]

    # Find the minimum and maximum scores for normalization, using only rows that are not 'NoAssignment'
    min_score = df_not_no_assignment['OverallScore'].min()
    max_score = df_not_no_assignment['OverallScore'].max()

    # Apply normalization only to rows that are not 'NoAssignment'
    df.loc[~df['NoAssignment'], 'OverallScore'] = (
        (df_not_no_assignment['OverallScore'] - min_score) / (max_score - min_score)) * 10

    return df


def average_scores_by_classroom(df):
    # Calculate the average scores for each classroom
    avg_scores = df.groupby(['CSM_BLDG', 'CSM_ROOM']).agg({
        'PrimeTimeScore': 'mean',
        'CapacityScore': 'mean',
        'InstructorScore': 'mean',
        'DoubleBookingPenalty': 'mean',
        'IdleTimeScore': 'mean',
        'OverallScore': 'mean',
    }).reset_index()

    # Merge the averaged scores back to the original dataframe
    df = pd.merge(df, avg_scores, on=['CSM_BLDG', 'CSM_ROOM'], suffixes=('', '_avg'))

    # Update the original score columns with their averaged versions
    score_columns = ['PrimeTimeScore', 'CapacityScore', 'InstructorScore', 'DoubleBookingPenalty', 'IdleTimeScore',
                     'OverallScore']
    for col in score_columns:
        df[col] = df[col + '_avg']

    # Drop the _avg columns
    df.drop([col for col in df.columns if col.endswith('_avg')], axis=1, inplace=True)
    return df


weights = {
    'prime_time_score': 1,  # High importance but not dominating
    'capacity_score': 25,  # Most crucial for physical space optimization
    'instructor_score': 1,  # Important for educational quality but secondary to physical concerns
    'double_booking_score': -20,  # Significant penalty for overlaps
    'idle_time_score': 0.0009  # Minor penalty for idle time, acknowledging some is necessary and the value is quite large
}


def optimize_classroom_schedule(df):
    df = initialize_dataframe_processing(df)

    # Check and handle 'No Assignment' conditions
    df['NoAssignment'] = df.apply(
        lambda x: x['Room Number'] == 'No Room Assigned' and x['CSM_BLDG'] == 'No Building Assigned' and x[
            'Floor Name'] == 'No Floor '
                             'Assigned',
        axis=1
    )

    # Proceed with conditional scoring
    # Ensures scoring functions are correctly applied to all rows, not just those without 'NoAssignment'
    df = calculate_prime_time_score(df, weights)
    df = calculate_capacity_score(df, weights)
    df = calculate_instructor_score(df, weights)
    df = calculate_double_booking_score(df, weights)
    df = calculate_idle_time_and_score(df, weights)
    df = calculate_overall_score(df)

    # Apply 0 to specific fields for 'NoAssignment' rows after all scoring functions
    # This ensures that the scores for 'NoAssignment' rows are set after averaging is done
    score_fields = ['PrimeTimeScore', 'CapacityScore', 'InstructorScore', 'DoubleBookingPenalty', 'IdleTimeScore',
                    'OverallScore']
    df.loc[df['NoAssignment'], score_fields] = 0
    df.loc[df['NoAssignment'], 'InstructorMethods_aggregated'] = [["{N/A}"]]

    # Average scores by classroom and finalize the DataFrame
    df = average_scores_by_classroom(df)
    df.drop('NoAssignment', axis=1, inplace=True)

    return df

