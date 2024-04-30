from django.contrib import admin
from .models import Building, Floor, Classroom, Course, User
from .serializers import BuildingSerializer, FloorSerializer, ClassroomSerializer, CourseSerializer, UserSerializer


@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    """
    Admin configuration for Building model.
    """
    list_display = ['building_id', 'building_name']
    ordering = ['building_id', 'building_name']


@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    """
    Admin configuration for Floor model.
    """
    list_display = ['floor_name', 'building_id']
    ordering = ['building_id', 'floor_name']


@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    """
    Admin configuration for Classroom model.
    """
    list_display = [
        'classroom_id',
        'classroom_number',
        'total_seats',
        'floor_id',
        'projectors',
        'microphone_system',
        'blueray_player',
        'laptop_hdmi',
        'movable_chairs',
        'piano',
        'printer',
    ]
    ordering = ['floor_id', 'classroom_number']
    list_filter = ['floor_id', 'projectors', 'movable_chairs', 'piano', 'printer']
    search_fields = ['classroom_number', 'notes']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """
    Admin configuration for Course model.
    """
    list_display = [
        'course_id',
        'course_name',
        'instructor',
        'start_time',
        'end_time',
        'course_cap',
        'enrollment_total',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ]
    ordering = ['course_name', 'start_time']
    list_filter = ['classroom', 'course_level', 'term']
    search_fields = ['course_name', 'instructor', 'course_id']


## PRECONFIGURED ADMIN FOR USERMODELS
admin.site.register(User)
