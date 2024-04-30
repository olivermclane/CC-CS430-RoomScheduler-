from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.contrib.postgres.fields import ArrayField


class Building(models.Model):
    """
    Model for representing a building.
    - building_id : The id of the building (pk)
    - building_name : The name of the building
    - image_url : The url of the image of the building
    """

    building_id = models.AutoField(primary_key=True)
    building_name = models.CharField(max_length=100, unique=True)
    image_url = models.URLField(null=True, blank=True)

    class Meta:
        app_label = 'roomschedulerapi'

    def __str__(self):
        return f"{self.building_name} (ID: {self.building_id})"


class Floor(models.Model):
    """
    Model for representing a floor.
    - floor_id : The id of the floor (pk)
    - floor_name : The name of the floor
    - building_name : The name of the building the floor is on
    - building : The building each floor is on (fk)
    """

    floor_id = models.AutoField(primary_key=True)
    floor_name = models.CharField(max_length=50)
    building_name = models.CharField(max_length=50, default=0)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)

    class Meta:
        app_label = 'roomschedulerapi'

    def __str__(self):
        return f"{self.floor_name} (ID: {self.floor_id})"


class Term(models.Model):
    """
    Model for representing a term.
    - term_id : The id of the term (pk)
    - term_name : The name of the term
    - created_at : The creation date of the term
    - updated_at : The last update date of the term
    """

    term_id = models.AutoField(primary_key=True)
    term_name = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'roomschedulerapi'

    def __str__(self):
        return f"{self.term_name} (ID: {self.term_id})"


class OptiScore(models.Model):
    """
    Model for representing optimization scores.
    - score_id : The id of the score (pk)
    - prime_time_score : The calculated score for if the classroom is scheduled during prime time
    - prime_time_utilization : The calculated score for if the classroom is used during prime time
    - capacity_score : The calculated score for if the classroom is used to capacity
    - instructor_score : The calculated score for if the use of instructors is optimal
    - instructor_methods : The calculated score for if the use of instructor needs that type of classroom
    - double_booking_score : The calculated score for if the classroom has more than one course scheduled at the same time
    - idle_time_score : The calculated score for how long the classroom is unused
    - double_booking : True if the classroom is double booked, false if it is not
    - overall score : The calculated score for the use of the classroom
    """

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

    class Meta:
        app_label = 'roomschedulerapi'

    def __str__(self):
        return f"{self.overall_score} (ID: {self.score_id})"


class Classroom(models.Model):
    """
    Model for representing a classroom.
    - classroom_id : ID of the classroom
    - classroom_name : Name of the classroom
    - classroom_number : The room number of the classroom
    - total_seats : The total number of seats
    - width_of_room : The width of the room
    - term : The term associated with this instance of the classroom
    - length_of_room : The length of the room
    - projectors : The projectors in this classroom
    - microphone_systems : True if the room has a microphone, False if the room does not
    - blueray_system : True if the room has a blueray system, False if the room does not
    - laptop_hdmi : True if the room has a laptop hdmi, False if the room does not
    - zoom_camera : True if the room has a zoom camera, False if the room does not
    - document_camera : True if the room has a document camera, False if the room does not
    - storage : True if the room has storage, False if the room does not
    - movable_chairs : True if the room has movable chairs, False if the room does not
    - printer : True if the room has a printer, False if the room does not
    - piano : True if the room has a piano, False if the room does not
    - stereo_system : True if the room has a stereo, False if the room does not
    - total_tv : Number of tvs in the room
    - sinks : Number of sinks in the room
    - notes : Any notes on the room
    - floor_name : Name of the floor the room is on
    - floor : The floor the classroom is on (fk)
    - optimization_score : The optimization score of the classroom (fk)

    """

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

    class Meta:
        app_label = 'roomschedulerapi'

    def __str__(self):
        return f"{self.classroom_name} (ID: {self.classroom_id})"


class Course(models.Model):
    """
    Model for representing a course.
    - course_id : The id of the course (pk)
    - classroom : The classroom the course is in (fk)
    - start_time : The start time of the course
    - end_time : The end time of the course
    - instructor : The instructor of the course
    - first_day : The first day of the course
    - last_day : The last day of the course
    - course_name : The name of the course
    - term : The term of the course (fk)
    - credits : The credits of the course
    - course_cap : The maximum amount of students in the class
    - waitlist_cap : The maximum amount of students allowed on the waitlist
    - enrollment_total : The total amount of students enrolled in the course
    - course_level : The level of the course
    - monday : True if the course is on Monday, False if the course is not
    - tuesday : True if the course is on Tuesday, False if the course is not
    - wednesday : True if the course is on Wednesday, False if the course is not
    - thursday : True if the course is on Thursday, False if the course is not
    - friday : True if the course is on Friday, False if the course is not
    - saturday : True if the course is on Saturday, False if the course is not
    - sunday : True if the course is on Sunday, False if the course is not
    """

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

    class Meta:
        app_label = 'roomschedulerapi'

    def __str__(self):
        return f"{self.course_name} - {self.start_time} - {self.end_time} (ID: {self.course_id})"

class User(AbstractUser):
    """
    Custom User model.
    - username : Username for the user
    - name : none
    - emails : Email of the user
    - is_active : True if the user is active, False otherwise
    - is_admin : True if the user is admin, False otherwise
    - created_at: datetime when the user was created
    - updated_at: datetime when the user was updated
    """

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
    temp_password_flag = models.BooleanField(default=False)
    temp_password_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    class Meta:
        app_label = 'roomschedulerapi'

    def __str__(self):
        return self.email

    def is_admin(self, perm, obj=None):
        return self.is_admin



