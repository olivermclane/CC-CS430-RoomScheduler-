from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.contrib.postgres.fields import ArrayField


class Building(models.Model):
    building_id = models.AutoField(primary_key=True)
    building_name = models.CharField(max_length=100, unique=True)
    image_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.building_name} (ID: {self.building_id})"


class Floor(models.Model):
    floor_id = models.AutoField(primary_key=True)
    floor_name = models.CharField(max_length=50)
    building_name = models.CharField(max_length=50, default=0)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.floor_name} (ID: {self.floor_id})"


class Term(models.Model):
    term_id = models.AutoField(primary_key=True)
    term_name = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.term_name} (ID: {self.term_id})"


class OptiScore(models.Model):
    score_id = models.AutoField(primary_key=True)
    prime_time_score = models.DecimalField(max_digits=5, decimal_places=2)
    prime_time_utilization = models.DecimalField(max_digits=5, decimal_places=2)
    capacity_score = models.DecimalField(max_digits=5, decimal_places=2)
    instructor_score = models.DecimalField(max_digits=5, decimal_places=2)
    instructor_methods = ArrayField(models.CharField())
    double_booking_score = models.DecimalField(max_digits=5, decimal_places=2)
    idle_time_score = models.DecimalField(max_digits=5, decimal_places=2)
    double_booking = models.BooleanField(default=False)
    overall_score = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.overall_score} (ID: {self.score_id})"


class Classroom(models.Model):
    classroom_id = models.AutoField(primary_key=True)
    classroom_name = models.CharField(max_length=1000, default=0)
    classroom_number = models.CharField(default=0)
    total_seats = models.IntegerField(default=0)
    width_of_room = models.IntegerField(default=0)
    term = models.ForeignKey(Term, on_delete=models.CASCADE, default=None)
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
    notes = models.CharField(max_length=200, blank=True)
    floor_name = models.CharField(default=0)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    optimization_score = models.ForeignKey(OptiScore, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.classroom_name} (ID: {self.classroom_id})"


class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, default=None)
    start_time = models.TimeField()
    end_time = models.TimeField()
    instructor = models.CharField(default='')
    first_day = models.DateField()
    last_day = models.DateField()
    course_name = models.CharField(max_length=100)
    term = models.ForeignKey(Term, on_delete=models.CASCADE, default=None)
    credits = models.IntegerField(default=0)
    course_cap = models.IntegerField(default=0)
    waitlist_cap = models.IntegerField(default=0)
    waitlist_total = models.IntegerField(default=0)
    enrollment_total = models.IntegerField(default=0)
    course_level = models.CharField(max_length=10)
    monday = models.BooleanField(default=False)
    tuesday = models.BooleanField(default=False)
    wednesday = models.BooleanField(default=False)
    thursday = models.BooleanField(default=False)
    friday = models.BooleanField(default=False)
    saturday = models.BooleanField(default=False)
    sunday = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.course_name} - {self.start_time} - {self.end_time} (ID: {self.course_id})"


class SavedSchedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    course_ids = models.ManyToManyField(Course)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)


"""
DJANGO DOCS
https://django-rest-framework-simplejwt.readthedocs.io/en/latest/

MEDIUM EXAMPLES 1) React Implementation of JWT, 2) Django JWT 
https://medium.com/@ronakchitlangya1997/jwt-authentication-with-react-js-and-django-c034aae1e60d
https://medium.com/@poorva59/implementing-simple-jwt-authentication-in-django-rest-framework-3e54212f14da

Follow for a deeper understanding of our authentication backend.
"""


class User(AbstractUser):
    ## Basic User Fields
    username = models.CharField(max_length=100, unique=True)
    name = None
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
