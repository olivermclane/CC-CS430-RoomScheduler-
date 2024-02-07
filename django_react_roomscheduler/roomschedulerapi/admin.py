from django.contrib import admin
from .models import Building, Floor, Classroom, Course


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
        'class_room_number',
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
    ordering = ['floor_id', 'class_room_number']
    list_filter = ['floor_id', 'projectors', 'movable_chairs', 'piano', 'printer']
    search_fields = ['class_room_number', 'notes']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = [
        'course_id',
        'course_name',
        'classroom_id',
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
    list_filter = ['classroom_id', 'course_level', 'term', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
                   'saturday', 'sunday']
    search_fields = ['course_name', 'instructor', 'course_id']

