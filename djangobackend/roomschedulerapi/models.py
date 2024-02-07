from django.db import models

# Create your models here.
class Course(models.Model):
    course_id = models.IntegerField()
    classroom_id = models.IntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    instructor = models.CharField(max_length=25)
    first_day = models.DateField()
    last_day = models.DateField()
    course_name = models.CharField(max_length=25)
    term = models.CharField(max_length=25)
    credits = models.IntegerField()
    subject = models.CharField(max_length=25)
    course_capacity = models.IntegerField()
    waitlist_capacity = models.IntegerField()
    course_total = models.IntegerField()
    waitlist_total = models.IntegerField()
    total_enrollment = models.IntegerField()
    course_level = models.IntegerField()
    monday = models.BooleanField()
    tuesday = models.BooleanField()
    wednesday = models.BooleanField()
    thursday = models.BooleanField()
    friday = models.BooleanField()
    saturday = models.BooleanField()
    sunday = models.BooleanField()

    def __str__(self):
        return self.course_name

class Classroom(models.Model):
    classroom_id = models.IntegerField()
    floor_id = models.IntegerField()
    def __str__(self):
        return self.classroom_id

class Floor(models.Model):
    floor_id = models.IntegerField()
    building_id = models.IntegerField()
    def __str__(self):
        return self.floor_id

class Building(models.Model):
    building_id = models.IntegerField()
    def __str__(self):
        return self.building_id
