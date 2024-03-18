'''
Feb. 4, 2024
Data Reader for computer science senior project.
Author: Hank Rugg

'''
import warnings

import pandas as pd
from roomschedulerapi.models import Building, Floor, Classroom, Course
warnings.filterwarnings("ignore", message="DataFrame is highly fragmented", category=pd.errors.PerformanceWarning)


def getMonthNum(month):
    if month == "Jan":
        return "1"
    elif month == "Feb":
        return "2"
    elif month == "Mar":
        return "3"
    elif month == "Apr":
        return "4"
    elif month == "May":
        return "5"
    elif month == "Jun":
        return "6"
    elif month == "Jul":
        return "7"
    elif month == "Aug":
        return "8"
    elif month == "Sep":
        return "9"
    elif month == "Oct":
        return "10"
    elif month == "Nov":
        return "11"
    elif month == "Dec":
        return "12"
    else:
        return "0"


class DataReader(object):


    def __init__(self, file):
        # load classroom data
        self.classRoomData = pd.read_csv(
            'roomschedulerapi/DataReader/Data/ClassroomInformation.csv')
        # load course data
        self.courseData = pd.read_excel(file)
        self.courseData['Classroom Name'] = self.courseData['CSM_BLDG'] + " " + self.courseData['CSM_ROOM']

        self.data = pd.merge(self.courseData, self.classRoomData, how='left', on="Classroom Name")

    def sortData(self):

        self.data.fillna(0, inplace=True)

        for i in range(len(self.data)):
            if self.data['CSM_BLDG'].iloc[i] == 0:
                self.data.loc[i, 'CSM_BLDG'] = "No Building Assigned"
            if self.data['Floor Name'].iloc[i] == 0:
                self.data.loc[i, 'Floor Name'] = "No Floor Assigned"
            if self.data['Room Number'].iloc[i] == 0:
                self.data.loc[i, 'Room Number'] = "No Room Assigned"

        self.data['CSM_SUNDAY'] = self.data['CSM_SUNDAY'].replace({'Y': True, '-': False})
        self.data['CSM_MONDAY'] = self.data['CSM_MONDAY'].replace({'Y': True, '-': False})
        self.data['CSM_TUESDAY'] = self.data['CSM_TUESDAY'].replace({'Y': True, '-': False})
        self.data['CSM_WEDNESDAY'] = self.data['CSM_WEDNESDAY'].replace({'Y': True, '-': False})
        self.data['CSM_THURSDAY'] = self.data['CSM_THURSDAY'].replace({'Y': True, '-': False})
        self.data['CSM_FRIDAY'] = self.data['CSM_FRIDAY'].replace({'Y': True, '-': False})
        self.data['CSM_SATURDAY'] = self.data['CSM_SATURDAY'].replace({'Y': True, '-': False})

        pattern = r'\s{1,2}'
        self.data[['StartMonth', 'StartDay', 'StartYear']] = self.data['SEC_START_DATE'].str.split(pattern, expand=True)
        self.data[['EndMonth', 'EndDay', 'EndYear']] = self.data['SEC_END_DATE'].str.split(pattern, expand=True)

        self.data['StartMonthNum'] = "0"
        self.data['EndMonthNum'] = "0"

        self.data['EndMonthNum'] = self.data['EndMonth'].apply(getMonthNum)
        self.data['StartMonthNum'] = self.data['StartMonth'].apply(getMonthNum)

        self.data['StartDate'] = pd.concat([self.data['StartYear'], self.data['StartMonthNum'], self.data['StartDay']], axis=1).apply(lambda x: '-'.join(x), axis=1)

        self.data['EndDate'] = pd.concat([self.data['EndYear'], self.data['EndMonthNum'], self.data['EndDay']], axis=1).apply(lambda x: '-'.join(x), axis=1)

        self.data = pd.concat([self.data, self.data['CSM_START_TIME'].str.split(":", expand=True)], axis=1)
        self.data.rename(columns={0: 'StartHour', 1: 'StartMinute'}, inplace=True)

        self.data = pd.concat([self.data, self.data['CSM_END_TIME'].str.split(":", expand=True)], axis=1)
        self.data.rename(columns={0: 'EndHour', 1: 'EndMinute'}, inplace=True)

        self.data['MilitaryStart'] = '00:00:00'
        self.data['MilitaryEnd'] = '00:00:00'

        for i in range(len(self.data)):
            if str(self.data['StartMinute'].iloc[i])[2] == "P":
                if self.data['StartHour'].iloc[i] != '12':
                    startHour = int(self.data['StartHour'].iloc[i]) + 12
                    self.data.loc[i, 'MilitaryStart'] = str(startHour) + ":" + self.data.loc[i, 'StartMinute'][0:2] + ":00"
                else:
                    startHour = int(self.data['StartHour'].iloc[i])
                    self.data.loc[i, 'MilitaryStart'] = str(startHour) + ":" + self.data.loc[i, 'StartMinute'][0:2] + ":00"
            elif str(self.data['StartMinute'].loc[i])[2] == "A":
                self.data.loc[i, 'MilitaryStart'] = self.data.loc[i, 'StartHour'] + ":" + self.data.loc[i, 'StartMinute'][0:2] + ":00"

            if str(self.data['EndMinute'].loc[i])[2] == "P":
                if self.data['EndHour'].loc[i] != '12':
                    endHour = int(self.data['EndHour'].loc[i]) + 12
                    self.data.loc[i, 'MilitaryEnd'] = str(endHour) + ":" + self.data.loc[i, 'EndMinute'][0:2] + ":00"

                else:
                    endHour = int(self.data['EndHour'].loc[i])
                    self.data.loc[i, 'MilitaryEnd'] = str(endHour) + ":" + self.data.loc[i, 'EndMinute'][0:2] + ":00"

            elif str(self.data['EndMinute'].loc[i])[2] == "A":
                self.data.loc[i, 'MilitaryEnd'] = self.data.loc[i, 'EndHour'] + ":" + self.data.loc[i, 'EndMinute'][0:2] + ":00"

    def loadData(self):
        Building.objects.all().delete()
        Floor.objects.all().delete()
        Classroom.objects.all().delete()
        Course.objects.all().delete()
        # load classes
        for c in range(len(self.courseData)):
            b = Building.objects.get_or_create(building_name=self.data['CSM_BLDG'].iloc[c])

            f = Floor.objects.get_or_create(floor_name=self.data['Floor Name'].iloc[c],
                                            building_name=self.data['CSM_BLDG'].iloc[c],
                                            building=b[0])
            cl = Classroom.objects.get_or_create(classroom_number=self.data['Room Number'].iloc[c],
                                                 classroom_name=self.data['Classroom Name'].iloc[c],
                                                 total_seats=self.data['Number of Student Seats in Room'].iloc[c],
                                                 width_of_room=self.data['Width of Room'].iloc[c],
                                                 length_of_room=self.data['Length of Room'].iloc[c],
                                                 projectors=self.data['Number of Projectors in Room'].iloc[c],
                                                 microphone_system=self.data['Microphone'].iloc[c],
                                                 blueray_player=self.data['BluRay'].iloc[c],
                                                 laptop_hdmi=self.data['Laptop HDMI input plug in'].iloc[c],
                                                 zoom_camera=self.data['Zoom'].iloc[c],
                                                 document_camera=self.data['Document Camera'].iloc[c],
                                                 storage=self.data['Storage'].iloc[c],
                                                 movable_chairs=self.data['Movable Chairs'].iloc[c],
                                                 printer=self.data['Printer'].iloc[c],
                                                 piano=self.data['Piano'].iloc[c],
                                                 stereo_system=self.data['Stereo'].iloc[c],
                                                 total_tv=self.data['TV'].iloc[c],
                                                 sinks=self.data['Sink'].iloc[c],
                                                 notes=self.data['Notes'].iloc[c],
                                                 floor_name=self.data['Floor Name'].iloc[c],
                                                 floor=f[0])
            cr = Course.objects.get_or_create(first_day=self.data['StartDate'].iloc[c],
                                              last_day=self.data['EndDate'].iloc[c],
                                              course_name=self.data['SEC_SHORT_TITLE'].iloc[c],
                                              term=self.data['SEC_TERM'].iloc[c],
                                              credits=self.data['SEC_MIN_CRED'].iloc[c],
                                              start_time=self.data['MilitaryStart'].iloc[c],
                                              end_time=self.data['MilitaryEnd'].iloc[c],
                                              monday=self.data['CSM_MONDAY'].iloc[c],
                                              tuesday=self.data['CSM_TUESDAY'].iloc[c],
                                              wednesday=self.data['CSM_WEDNESDAY'].iloc[c],
                                              thursday=self.data['CSM_THURSDAY'].iloc[c],
                                              friday=self.data['CSM_FRIDAY'].iloc[c],
                                              saturday=self.data['CSM_SATURDAY'].iloc[c],
                                              sunday=self.data['CSM_SUNDAY'].iloc[c],
                                              instructor=self.data['SEC_FACULTY_INFO'].iloc[c],
                                              enrollment_total=self.data['STUDENTS_AND_RESERVED_SEATS'].iloc[c],
                                              course_cap=self.data['SEC_CAPACITY'].iloc[c],
                                              waitlist_cap=self.data['XL_WAITLIST_MAX'].iloc[c],
                                              waitlist_total=self.data['WAITLIST'].iloc[c],
                                              course_level=self.data['SEC_COURSE_NO'].iloc[c],
                                              classroom=cl[0])