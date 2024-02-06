'''
Feb. 4, 2024
Data Reader for computer science senior project.
Author: Hank Rugg

**** Not Complete, needs to be updated to match database schema ******
'''

import pandas as pd


# from models.roomschedulerapi import Course, Building, Floor, Room

class DataReader(object):

    def __init__(self):
        # load course data
        self.courseData = pd.read_csv('2024SpingAllClassSchedule.csv')
        # load classroom data
        self.classData = pd.read_csv('ClassroomCapacities.csv')

    def loadData(self):
        # load classes
        for c in range(len(self.courseData)):
            Course(Course=self.courseData['COURSE_SECTIONS_ID'].iloc[c],
                   Section=self.courseData['SECTION_STATUS'].iloc[c],
                   StartDate=self.courseData['SEC_START_DATE'].iloc[c],
                   EndDate=self.courseData['SEC_END_DATE'].iloc[c],
                   Subject=self.courseData['SEC_SUBJECT'].iloc[c],
                   CourseNumber=self.courseData['SEC_COURSE_NO'].iloc[c],
                   ShortTitle=self.courseData['SEC_SHORT_TITLE'].iloc[c],
                   MinCredits=self.courseData['SEC_MIN_CRED'].iloc[c],
                   StartTime=self.courseData['CSM_START_TIME'].iloc[c],
                   EndTime=self.courseData['CSM_END_TIME'].iloc[c],
                   Monday=self.courseData['CSM_MONDAY'].iloc[c],
                   Tuesday=self.courseData['CSM_TUESDAY'].iloc[c],
                   Wednesday=self.courseData['CSM_WEDNESDAY'].iloc[c],
                   Thursday=self.courseData['CSM_THURSDAY'].iloc[c],
                   Friday=self.courseData['CSM_FRIDAY'].iloc[c],
                   Saturday=self.courseData['CSM_SATURDAY'].iloc[c],
                   Sunday=self.courseData['CSM_SUNDAY'].iloc[c],
                   Building=self.courseData['CSM_BUILDING'].iloc[c],
                   Room=self.courseData['CSM_ROOM'].iloc[c],
                   InstructionMethod=self.courseData['CSM_INSTR_METHOD'].iloc[c],
                   Faculty=self.courseData['SEC_FACULTY_INFO'].iloc[c],
                   StudentEnrollment=self.courseData['STUDENTS_AND_RESERVED_SEATS'].iloc[c],
                   StudentCapacity=self.courseData['SEC_CAPACITY'].iloc[c],
                   Waitlist=self.courseData['WAITLIST'].iloc[c].iloc[c],
                   ChargeAmount=self.courseData['CHARGE_AMT_1'].iloc[c],
                   NumberOfWeeks=self.courseData['SEC_NO_WEEKS'].iloc[c],
                   ).save()

        # load classroom data
        for c in range(len(self.classData)):
            Room(Building=self.classData['Building'].iloc[c],
                 RoomNumber=self.classData['Room'].iloc[c],
                 Capacity=self.classData['Max Capacity'].iloc[c],
                 ).save()
