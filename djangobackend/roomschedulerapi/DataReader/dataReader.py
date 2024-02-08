'''
Feb. 4, 2024
Data Reader for computer science senior project.
Author: Hank Rugg

**** Not Complete, needs to be tested and foreign key ids need to be added
'''

import pandas as pd
from django_react_roomscheduler.roomschedulerapi.models import Building, Floor, Classroom, Course


class DataReader(object):

    def __init__(self):
        # load classroom data
        self.classRoomData = pd.read_csv('Copy of Classroom Capacities - 23_24.csv')
        # load course data
        self.courseData = pd.read_csv('Spring 2024 Schedule for Computer Science Senior Project.csv')

        self.data = pd.merge(self.courseData, self.classRoomData, how='left', on="Name")

    def loadData(self):
        # load classes
        for c in range(len(self.courseData)):
            Building(building_name=self.data['CSM_BLDG']
                     ).save()
            Floor(floor_name=self.data['']
                  ).save()  # We don't have floor names
            Classroom(class_room_number=self.data['Room'].iloc[c],
                      total_seats=self.data['Max Capacity'].iloc[c]
                      ).save()
            Course(first_dat=self.data['SEC_START_DATE'].iloc[c],
                   last_dat=self.data['SEC_END_DATE'].iloc[c],
                   course_name=self.data['SEC_SHORT_TITLE'].iloc[c],
                   term=self.data['SEC_TERM'].iloc[c],
                   credits=self.data['SEC_MIN_CRED'].iloc[c],
                   start_time=self.data['CSM_START_TIME'].iloc[c],
                   end_time=self.data['CSM_END_TIME'].iloc[c],
                   monday=self.data['CSM_MONDAY'].iloc[c],
                   tuesday=self.data['CSM_TUESDAY'].iloc[c],
                   wednesday=self.data['CSM_WEDNESDAY'].iloc[c],
                   thursday=self.data['CSM_THURSDAY'].iloc[c],
                   friday=self.data['CSM_FRIDAY'].iloc[c],
                   saturday=self.data['CSM_SATURDAY'].iloc[c],
                   sunday=self.data['CSM_SUNDAY'].iloc[c],
                   InstructionMethod=self.data['CSM_INSTR_METHOD'].iloc[c],
                   instructor=self.data['SEC_FACULTY_INFO'].iloc[c],
                   enrollment_total=self.data['STUDENTS_AND_RESERVED_SEATS'].iloc[c],
                   course_cap=self.data['SEC_CAPACITY'].iloc[c],
                   waitlist_cap=self.data['XL_WAITLIST_MAX'].iloc[c],
                   course_level=self.data['SEC_COURSE_NO'].iloc[c],
                   ).save()
