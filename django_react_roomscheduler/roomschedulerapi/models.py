from django.db import models
from django.contrib.postgres.fields import ArrayField


class Building(models.Model):
    building_id = models.AutoField(primary_key=True)
    building_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.building_name} (ID: {self.building_id})"


class Floor(models.Model):
    floor_id = models.AutoField(primary_key=True)
    floor_name = models.CharField(max_length=50)
    building_id = models.ForeignKey(Building, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.floor_name} (ID: {self.floor_id})"


class Classroom(models.Model):
    classroom_id = models.AutoField(primary_key=True)
    classroom_number = models.IntegerField(default=0)
    total_seats = models.IntegerField(default=0)
    width_of_room = models.IntegerField(default=0)
    length_of_room = models.IntegerField(default=0)
    projectors = models.IntegerField(default=0)
    microphone_system = models.BooleanField(default=0)
    blueray_player = models.BooleanField(default=False)
    laptop_hdmi = models.BooleanField(default=False)
    zoom_camera = models.BooleanField(default=False)
    document_camera = models.BooleanField(default=False)
    storage = models.BooleanField(default=False)
    movable_chairs = models.BooleanField(default=False)
    printer = models.BooleanField(default=False)
    piano = models.BooleanField(default=False)
    stereo_system = models.BooleanField(default=False)
    total_tv = models.IntegerField(default=0)
    sinks = models.IntegerField(default=0)
    notes = models.CharField(max_length=200, blank=False)
    floor_id = models.ForeignKey(Floor, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.classroom_number} (ID: {self.classroom_id})"


class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    classroom_id = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()
    instructor = models.CharField
    first_day = models.DateField()
    last_day = models.DateField()
    course_name = models.CharField(max_length=100)
    term = models.CharField(max_length=10, blank=True)
    credits = models.IntegerField(default=0)
    course_cap = models.IntegerField(default=0)
    waitlist_cap = models.IntegerField(default=0)
    course_total = models.IntegerField(default=0)
    waitlist_total = models.IntegerField(default=0)
    enrollment_total = models.IntegerField(default=0)
    course_level = models.CharField(max_length=3)
    monday = models.BooleanField(default=False)
    tuesday = models.BooleanField(default=False)
    wednesday = models.BooleanField(default=False)
    thursday = models.BooleanField(default=False)
    friday = models.BooleanField(default=False)
    saturday = models.BooleanField(default=False)
    sunday = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.course_name} - {self.start_time} - {self.end_time} (ID: {self.course_id})"
