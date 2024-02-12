from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models


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
    notes = models.TextField(blank=True)
    floor_id = models.ForeignKey(Floor, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.classroom_number} (ID: {self.classroom_id})"


class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    classroom_id = models.ManyToManyField(Classroom)
    start_time = models.TimeField()
    end_time = models.TimeField()
    instructor = models.CharField()
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
    DAY_CHOICES = [('MON', 'Monday'), ('TUE', 'Tuesday'), ('WED', 'Wednesday'), ('THURS', 'THURSDAY'), ('FRI', 'Friday'), ('SAT', 'Saturday'), ('SUN', 'Sunday')]
    days_of_week = models.CharField(max_length=8, choices=DAY_CHOICES)


    def __str__(self):
        return f"{self.course_name} - {self.start_time} - {self.end_time} (ID: {self.course_id})"


class SavedSchedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    course_ids = models.ManyToManyField(Course)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)








class User(AbstractUser):
    ## Basic User Fields
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(
        verbose_name='Email',
        max_length=255,
        unique=True,
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    ## Custom User Fields
    user_schedules = models.ManyToManyField(SavedSchedule)

    ## User Settings
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()
    def __str__(self):
        return self.email

    def is_admin(self, perm, obj=None):
        return self.is_admin

