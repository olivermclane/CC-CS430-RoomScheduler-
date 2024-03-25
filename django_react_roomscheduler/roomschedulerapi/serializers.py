from rest_framework import serializers
from .models import Building, Floor, Classroom, Course, User, Term, OptiScore


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = '__all__'


class FloorSerializer(serializers.ModelSerializer):
    building = BuildingSerializer(read_only=True)

    class Meta:
        model = Floor
        fields = ['floor_id', 'floor_name', 'building']


class OptiScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptiScore
        fields = '__all__'


class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Term
        fields = ['term_id', 'term_name']


class ClassroomSerializer(serializers.ModelSerializer):
    floor = FloorSerializer(read_only=True)
    optimization_score = OptiScoreSerializer(read_only=True)  # Correct this line
    term = TermSerializer(read_only=True)

    class Meta:
        model = Classroom
        fields = [
            'classroom_id',
            'classroom_number',
            'total_seats',
            'width_of_room',
            'length_of_room',
            'projectors',
            'term',
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
            'optimization_score',
            'total_tv',
            'sinks',
            'notes',
            'floor',
        ]


class CourseSerializer(serializers.ModelSerializer):
    classroom = ClassroomSerializer(read_only=True)
    term = TermSerializer(read_only=True)

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


class ClassroomCourseSerializer(serializers.ModelSerializer):
    classroom = ClassroomSerializer(read_only=True)
    term = TermSerializer(read_only=True)
    class Meta:
        model = Course
        fields = [
            'course_id',
            'classroom_id',
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
