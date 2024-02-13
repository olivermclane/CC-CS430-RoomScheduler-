from rest_framework import serializers
from .models import Building, Floor, Classroom, Course, User


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = '__all__'


class FloorSerializer(serializers.ModelSerializer):
    building = BuildingSerializer(read_only=True)

    class Meta:
        model = Floor
        fields = ['floor_id', 'floor_name', 'building']


class ClassroomSerializer(serializers.ModelSerializer):
    floor = FloorSerializer(read_only=True)

    class Meta:
        model = Classroom
        fields = [
            'classroom_id',
            'classroom_number',
            'total_seats',
            'width_of_room',
            'length_of_room',
            'projectors',
            'microphone_system',
            'blueray_player',
            'laptop_hdmi',
            'zoom_camera',
            'document_camera',
            'storage',
            'movable_chairs',
            'printer',
            'piano',
            'stereo_system',
            'total_tv',
            'sinks',
            'notes',
            'floor',
        ]


class CourseSerializer(serializers.ModelSerializer):
    classroom = ClassroomSerializer(read_only=True, many=True)

    class Meta:
        model = Course
        fields = [
            'course_id',
            'start_time',
            'end_time',
            'instructor',
            'first_day',
            'last_day',
            'course_name',
            'term',
            'credits',
            'course_cap',
            'waitlist_cap',
            'course_total',
            'waitlist_total',
            'enrollment_total',
            'course_level',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
            'classroom',

        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create(email=validated_data['email'],
                                   username=validated_data['username']
                                   )
        user.set_password(validated_data['password'])
        user.save()
        return user
