from django.contrib import admin
from .models import Building, Floor, Classroom, Course, User


@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ['building_id', 'building_name']
    ordering = ['building_id', 'building_name']


@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    list_display = ['floor_name', 'building_id']
    ordering = ['building_id', 'floor_name']


@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
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
    list_display = [
        'course_id',
        'course_name',
        'instructor',
        'start_time',
        'end_time',
        'course_cap',
        'enrollment_total',
        'days_of_week',
    ]
    ordering = ['course_name', 'start_time']
    list_filter = ['classroom_id', 'course_level', 'term']
    search_fields = ['course_name', 'instructor', 'course_id']


## PRECONFIGURED ADMIN FOR USERMODELS
admin.site.register(User)
