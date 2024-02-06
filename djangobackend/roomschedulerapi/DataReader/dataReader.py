'''
Feb. 4, 2024
Data Reader for computer science senior project.
Author: Hank Rugg

**** Not Complete, needs to be updated to match database schema ******
'''

import pandas as pd
# from models.roomschedulerapi import Course, Building, Floor, Room

# load course data
data = pd.read_csv('2024SpingAllClassSchedule.csv')

# load class data
classData = pd.read_csv('ClassroomCapacities.csv')

# load classes
for c in range(len(data)):
    Course(Course=data['COURSE_SECTIONS_ID'].iloc[c],
          Section=data['SECTION_STATUS'].iloc[c],
          StartDate=data['SEC_START_DATE'].iloc[c],
          EndDate=data['SEC_END_DATE'].iloc[c],
          Subject=data['SEC_SUBJECT'].iloc[c],
          CourseNumber=data['SEC_COURSE_NO'].iloc[c],
          ShortTitle=data['SEC_SHORT_TITLE'].iloc[c],
          MinCredits=data['SEC_MIN_CRED'].iloc[c],
          StartTime=data['CSM_START_TIME'].iloc[c],
          EndTime=data['CSM_END_TIME'].iloc[c],
          Monday=data['CSM_MONDAY'].iloc[c],
          Tuesday=data['CSM_TUESDAY'].iloc[c],
          Wednesday=data['CSM_WEDNESDAY'].iloc[c],
          Thursday=data['CSM_THURSDAY'].iloc[c],
          Friday=data['CSM_FRIDAY'].iloc[c],
          Saturday=data['CSM_SATURDAY'].iloc[c],
          Sunday=data['CSM_SUNDAY'].iloc[c],
          Building=data['CSM_BUILDING'].iloc[c],
          Room=data['CSM_ROOM'].iloc[c],
          InstructionMethod=data['CSM_INSTR_METHOD'].iloc[c],
          Faculty=data['SEC_FACULTY_INFO'].iloc[c],
          StudentEnrollment=data['STUDENTS_AND_RESERVED_SEATS'].iloc[c],
          StudentCapacity=data['SEC_CAPACITY'].iloc[c],
          Waitlist=data['WAITLIST'].iloc[c].iloc[c],
          ChargeAmount=data['CHARGE_AMT_1'].iloc[c],
          NumberOfWeeks=data['SEC_NO_WEEKS'].iloc[c],
          ).save()

# load classroom data
for c in range(len(classData)):
      Room(Building=classData['Building'].iloc[c],
           RoomNumber=classData['Room'].iloc[c],
           Capacity=classData['Max Capacity'].iloc[c],
           ).save()