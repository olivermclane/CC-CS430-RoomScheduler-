'''
Feb. 4, 2024
Data Reader for computer science senior project.
Author: Hank Rugg

'''

import pandas as pd
from tkinter import filedialog
from roomschedulerapi.models import Building, Floor, Classroom, Course, Term
import logging


logger = logging.getLogger(__name__)


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
                self.data['CSM_BLDG'].iloc[i] = "No assigned building"
            if self.data['Floor Name'].iloc[i] == 0:
                self.data['Floor Name'].iloc[i] = "No assigned floor"
            if self.data['Room Number'].iloc[i] == 0:
                self.data['Room Number'].iloc[i] = "No assigned room"

        for i in range(len(self.courseData)):
            # mondays
            if self.data['CSM_MONDAY'].loc[i] == "Y":
                self.data['CSM_MONDAY'].loc[i] = True
            else:
                self.data['CSM_MONDAY'].loc[i] = False
            # tuesdays
            if self.data['CSM_TUESDAY'].loc[i] == "Y":
                self.data['CSM_TUESDAY'].loc[i] = True
            else:
                self.data['CSM_TUESDAY'].loc[i] = False
            # wednesdays
            if self.data['CSM_WEDNESDAY'].loc[i] == "Y":
                self.data['CSM_WEDNESDAY'].loc[i] = True
            else:
                self.data['CSM_WEDNESDAY'].loc[i] = False
            # thursdays
            if self.data['CSM_THURSDAY'].loc[i] == "Y":
                self.data['CSM_THURSDAY'].loc[i] = True
            else:
                self.data['CSM_THURSDAY'].loc[i] = False
            # fridays
            if self.data['CSM_FRIDAY'].loc[i] == "Y":
                self.data['CSM_FRIDAY'].loc[i] = True
            else:
                self.data['CSM_FRIDAY'].loc[i] = False
            # saturdays
            if self.data['CSM_SATURDAY'].loc[i] == "Y":
                self.data['CSM_SATURDAY'].loc[i] = True
            else:
                self.data['CSM_SATURDAY'].loc[i] = False
            # sundays
            if self.data['CSM_SUNDAY'].loc[i] == "Y":
                self.data['CSM_SUNDAY'].loc[i] = True
            else:
                self.data['CSM_SUNDAY'].loc[i] = False

        pattern = r'\s{1,2}'
        self.data[['StartMonth', 'StartDay', 'StartYear']] = self.data['SEC_START_DATE'].str.split(pattern,
                                                                                                   expand=True)
        self.data[['EndMonth', 'EndDay', 'EndYear']] = self.data['SEC_END_DATE'].str.split(pattern, expand=True)

        self.data['StartMonthNum'] = "0"
        self.data['EndMonthNum'] = "0"
        for i in range(len(self.data)):
            self.data['StartMonthNum'].iloc[i] = getMonthNum(self.data['StartMonth'].iloc[i])
            self.data['EndMonthNum'].iloc[i] = getMonthNum(self.data['EndMonth'].iloc[i])

        self.data['StartDate'] = self.data['StartYear'] + '-' + self.data['StartMonthNum'] + '-' + self.data[
            'StartDay']
        self.data['EndDate'] = self.data['EndYear'] + '-' + self.data['EndMonthNum'] + '-' + self.data['EndDay']

        self.data[['StartHour', 'StartMinute']] = self.data['CSM_START_TIME'].str.split(":", expand=True)
        self.data[['EndHour', 'EndMinute']] = self.data['CSM_END_TIME'].str.split(":", expand=True)

        self.data['MilitaryStart'] = '00:00:00'
        self.data['MilitaryEnd'] = '00:00:00'

        for i in range(len(self.data)):
            if str(self.data['StartMinute'].iloc[i])[2] == "P":
                print(type(self.data['StartHour'].iloc[i]))
                if self.data['StartHour'].iloc[i] != '12':
                    startHour = int(self.data['StartHour'].iloc[i]) + 12
                    self.data['MilitaryStart'].iloc[i] = str(startHour) + ":" + self.data['StartMinute'].iloc[i][
                                                                                0:2] + ":00"
                else:
                    startHour = int(self.data['StartHour'].iloc[i])
                    self.data['MilitaryStart'].iloc[i] = str(startHour) + ":" + self.data['StartMinute'].iloc[i][
                                                                                0:2] + ":00"
            elif str(self.data['StartMinute'].iloc[i])[2] == "A":
                self.data['MilitaryStart'].iloc[i] = self.data['StartHour'].iloc[i] + ":" + \
                                                     self.data['StartMinute'].iloc[i][0:2] + ":00"

            if str(self.data['EndMinute'].iloc[i])[2] == "P":
                if self.data['EndHour'].iloc[i] != '12':
                    endHour = int(self.data['EndHour'].iloc[i]) + 12
                    self.data['MilitaryEnd'].iloc[i] = str(endHour) + ":" + self.data['EndMinute'].iloc[i][0:2] + ":00"

                else:
                    endHour = int(self.data['EndHour'].iloc[i])
                    self.data['MilitaryEnd'].iloc[i] = str(endHour) + ":" + self.data['EndMinute'].iloc[i][0:2] + ":00"

            elif str(self.data['EndMinute'].iloc[i])[2] == "A":
                self.data['MilitaryEnd'].iloc[i] = self.data['EndHour'].iloc[i] + ":" + self.data['EndMinute'].iloc[
                                                                                            i][0:2] + ":00"
        print("Saving csv")
        self.data.to_csv("saved.csv", index=True)

    def loadData(self):
        logger.info("Loading new data started for term", self.courseData['SEC_TERM'].iloc[0])

        current_term_name = self.courseData['SEC_TERM'].iloc[0]  # Assuming it's in the first row
        current_term, _ = Term.objects.get_or_create(term_name=current_term_name)


        Course.objects.filter(term=current_term).delete()

        # load classes
        for c in range(len(self.courseData)):
            b, _ = Building.objects.get_or_create(building_name=self.data['CSM_BLDG'].iloc[c])
            logger.info("Added new building to the database, ", b.building_name)

            f, _ = Floor.objects.get_or_create(floor_name=self.data['Floor Name'].iloc[c],
                                               building_name=self.data['CSM_BLDG'].iloc[c],
                                               building=b)

            logger.info("Added new floor to the database, ", f.floor_name)
            cl, _ = Classroom.objects.get_or_create(classroom_number=self.data['Room Number'].iloc[c],
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
                                                    floor=f)

            logger.info("Added new classroom to the database, ", cl.classroom_name)
            cr, _ = Course.objects.get_or_create(first_day=self.data['StartDate'].iloc[c],
                                                 last_day=self.data['EndDate'].iloc[c],
                                                 course_name=self.data['SEC_SHORT_TITLE'].iloc[c],
                                                 term=current_term,
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
                                                 classroom=cl)

            logger.info("Added new course to the database, ", cr.course_name)


