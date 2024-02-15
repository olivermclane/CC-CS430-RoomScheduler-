'''
Feb. 4, 2024
Data Reader for computer science senior project.
Author: Hank Rugg

'''

import pandas as pd
from roomschedulerapi.models import Building, Floor, Classroom, Course


class DataReader(object):

    def __init__(self):
        # load classroom data
        self.classRoomData = pd.read_csv(
            'roomschedulerapi/DataReader/Data/ClassroomInformation.csv')
        # load course data
        self.courseData = pd.read_csv(
            'roomschedulerapi/DataReader/Data/Spring2024Schedule.csv')

        self.data = pd.merge(self.courseData, self.classRoomData, how='left', on="Classroom Name")
        self.data['Military Start'].fillna("00:00:00", inplace=True)
        self.data['Military End'].fillna("00:00:00", inplace=True)
        self.data.fillna(0, inplace=True)

    def loadData(self):
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
            cr = Course.objects.get_or_create(first_day=self.data['Start Date'].iloc[c],
                                              last_day=self.data['End Date'].iloc[c],
                                              course_name=self.data['SEC_SHORT_TITLE'].iloc[c],
                                              term=self.data['SEC_TERM'].iloc[c],
                                              credits=self.data['SEC_MIN_CRED'].iloc[c],
                                              start_time=self.data['Military Start'].iloc[c],
                                              end_time=self.data['Military End'].iloc[c],
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
