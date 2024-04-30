from datetime import time, date
from unittest.mock import patch

from django.core.files import File
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from .models import Building, Classroom, Term, Floor, Course


class LoginViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)

    def test_login_success(self):
        response = self.client.post('/login/', data=self.user_data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('refresh' in response.data)
        self.assertTrue('access' in response.data)

    def test_login_failure_invalid_email(self):
        invalid_email_data = {
            'email': 'invalid@example.com',
            'password': 'test_password',
        }
        response = self.client.post('/login/', data=invalid_email_data)
        self.assertEqual(response.status_code, 401)
        self.assertTrue('detail' in response.data)
        self.assertEqual(str(response.data['detail']), "No active account found with the given credentials")

    def test_login_failure_invalid_password(self):
        invalid_password_data = {
            'email': 'test@example.com',
            'password': 'invalid_password',
        }
        response = self.client.post('/login/', data=invalid_password_data)
        self.assertEqual(response.status_code, 401)
        self.assertTrue('detail' in response.data)
        self.assertEqual(str(response.data['detail']), "No active account found with the given credentials")


class RefreshTokenTestCase(APITestCase):
    def setUp(self):
        # Setup method to create a user
        self.user_model = get_user_model()
        self.user = self.user_model.objects.create_user(username='testuser', email='test@example.com',
                                                        password='testpassword123')
        self.login_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')

    def test_refresh_token_valid_refresh_token(self):
        response = self.client.post(self.login_url, {'email': 'test@example.com', 'password': 'testpassword123'})
        self.assertEqual(response.status_code, 200)
        access_token = response.data['access']
        refresh_token = response.data['refresh']

        refresh_response = self.client.post(self.refresh_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(refresh_response.status_code, 200)
        new_access_token = refresh_response.data['access']

        self.assertNotEqual(access_token, new_access_token)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {new_access_token}')
        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['message'], 'Successfully logged out')

    def test_refresh_token_invalid_refresh_token(self):
        invalid_refresh_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYwNzY2NzE1OSwianRpIjoiYjI2M2JmMzllYjVlNGY4OGJhZGU2MjUyODJlOTc0MTEiLCJ1c2VyX2lkIjozfQ.SflKxwRJSMeKKF2QT4fwpMeJpXUbbV3LkTjbyQ6AGsM"  # This is just an example; use a format that looks like your actual tokens but is clearly invalid
        response = self.client.post(self.refresh_url, {'refresh': invalid_refresh_token}, format='json')
        self.assertNotEqual(response.status_code, 200, "The request should not be successful with an invalid token.")
        self.assertEqual(response.data['detail'], 'Token is invalid or expired',
                         "The error message should indicate the token is invalid or expired.")
        self.assertEqual(response.data['code'], 'token_not_valid',
                         "The error code should indicate the token is not valid.")


class RegisterViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_user_data = {
            'username': 'test_user',
            'email': 'test@example.com',
            'password': 'test_password',
        }
        self.invalid_user_data = {
            'username': 'test_user',
            'email': 'invalid_email',
            'password': 'test_password',
        }

    def test_register_success(self):
        response = self.client.post('/register/', data=self.valid_user_data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('refresh' in response.data)
        self.assertTrue('access' in response.data)

    def test_register_failure_invalid_email(self):
        response = self.client.post('/register/', data=self.invalid_user_data)
        self.assertEqual(response.status_code, 400)
        self.assertTrue('email' in response.data)
        self.assertEqual(response.data['email'][0], 'Enter a valid email address.')


class LogoutViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)
        response = self.client.post('/login/', data=self.user_data)
        self.access_token = response.data['access']

    def test_logout(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['message'], 'Successfully logged out')


class BuildingViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)
        response = self.client.post('/login/', data=self.user_data)
        self.access_token = response.data['access']
        self.building = Building.objects.create(building_name="Test Building 1",
                                                image_url="http://example.com/img1.jpg")
        Building.objects.create(building_name="Test Building 2", image_url="http://example.com/img2.jpg")

    def test_get_buildings_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get("/buildings/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one building")
        building_fields = ['building_id', 'building_name', 'image_url']
        for building in response.data:
            for building_field in building_fields:
                self.assertIn(building_field, building, f"{building_field} is missing in 'building' nested data")

        self.assertTrue(len(response.data) <= 3, "Should return at least one building")

    def test_get_buildings_unauthenticated(self):
        response = self.client.get("/buildings/")
        self.assertEqual(response.status_code, 401, "Should return 401 for unauthenticated access")

    def test_building_detail_view(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse('building-detail', kwargs={'pk': self.building.building_id}))
        self.assertEqual(response.status_code, 200)
        building_fields = ['building_id', 'building_name', 'image_url']
        for building_field in building_fields:
            self.assertIn(building_field, response.data, f"{building_field} is missing in 'building' nested data")

        self.assertTrue(len(response.data) <= 3, "Should return at least one building")

    def test_building_detail_view_not_found(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse('building-detail', kwargs={'pk': 999}))

        self.assertEqual(response.status_code, 404, f"Should return 404 invalid building")
        self.assertEqual(response.data['error'], 'Building not found')

    def test_get_buildings_detail_unauthenticated(self):
        response = self.client.get(reverse('building-detail', kwargs={'pk': self.building.building_id}))
        self.assertEqual(response.status_code, 401, "Should return 401 for unauthenticated access")


class ClassroomViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)
        response = self.client.post('/login/', data=self.user_data)
        self.access_token = response.data['access']
        self.building = Building.objects.create(building_name="Test Building 1", image_url="http://example.com")

        self.term = Term.objects.create(term_name="SP2024")

        self.floor = Floor.objects.create(floor_name="First Floor", building_name="Main", building=self.building)

        self.classroom = Classroom.objects.create(classroom_name="Classroom A", classroom_number="1", total_seats=30,
                                                  term=self.term,
                                                  floor=self.floor)
        Classroom.objects.create(classroom_name="Classroom B", classroom_number="2", total_seats=25, term=self.term,
                                 floor=self.floor)

    def test_get_classrooms_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/classrooms/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one classroom")
        required_classroom_fields = [
            'classroom_id', 'classroom_number', 'total_seats', 'width_of_room', 'length_of_room',
            'projectors', 'microphone_system', 'blueray_player', 'laptop_hdmi', 'zoom_camera',
            'document_camera', 'storage', 'movable_chairs', 'printer', 'piano', 'stereo_system',
            'optimization_score', 'total_tv', 'sinks', 'notes', 'floor'
        ]
        # Check each classroom in the response
        for classroom_data in response.data:
            # Check for presence of all required classroom fields
            for field in required_classroom_fields:
                self.assertIn(field, classroom_data, f"{field} is missing in the response data")

    def test_get_classrooms_unauthenticated(self):
        response = self.client.get('/classrooms/')
        self.assertEqual(response.status_code, 401)

    def test_classroom_detail_view(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(
            reverse('classrooms-detail', kwargs={'pk': self.classroom.classroom_id}))
        self.assertEqual(response.status_code, 200)
        required_classroom_fields = [
            'classroom_id', 'classroom_number', 'total_seats', 'width_of_room', 'length_of_room',
            'projectors', 'microphone_system', 'blueray_player', 'laptop_hdmi', 'zoom_camera',
            'document_camera', 'storage', 'movable_chairs', 'printer', 'piano', 'stereo_system',
            'optimization_score', 'total_tv', 'sinks', 'notes', 'floor', 'term'
        ]

        # Check each classroom in the response
        for field in response.data:
            self.assertIn(field, required_classroom_fields, f"{field} is missing in the response data")

    def test_classroom_detail_view_not_found(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse('classrooms-detail', kwargs={'pk': 999}))
        self.assertEqual(response.status_code, 404)

    def test_get_classroom_detail_unauthenticated(self):
        response = self.client.get(reverse('classrooms-detail', kwargs={'pk': self.classroom.classroom_id}))
        self.assertEqual(response.status_code, 401)


class ClassroomTermViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)
        response = self.client.post('/login/', data=self.user_data)
        self.access_token = response.data['access']
        self.building = Building.objects.create(building_name="Test Building 1", image_url="http://example.com")

        self.term = Term.objects.create(term_name="SP2024")

        self.floor = Floor.objects.create(floor_name="First Floor", building_name="Main", building=self.building)

        self.classroom_a = Classroom.objects.create(classroom_name="Classroom A", classroom_number="1", total_seats=30,
                                                    term=self.term,
                                                    floor=self.floor)
        self.classroom_b = Classroom.objects.create(classroom_name="Classroom B", classroom_number="2", total_seats=25,
                                                    term=self.term,
                                                    floor=self.floor)

    def test_get_classrooms_terms_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("classrooms-term", kwargs={'term': self.term.term_id}))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one classroom")

        required_classroom_fields = [
            'classroom_id', 'classroom_number', 'total_seats', 'width_of_room', 'length_of_room',
            'projectors', 'microphone_system', 'blueray_player', 'laptop_hdmi', 'zoom_camera',
            'document_camera', 'storage', 'movable_chairs', 'printer', 'piano', 'stereo_system',
            'optimization_score', 'total_tv', 'sinks', 'notes', 'floor'
        ]

        # Check each classroom in the response
        for classroom_data in response.data:
            # Check for presence of all required classroom fields
            for field in required_classroom_fields:
                self.assertIn(field, classroom_data, f"{field} is missing in the response data")

    def test_get_classrooms_terms_unauthenticated(self):
        response = self.client.get(reverse("classrooms-term", kwargs={'term': self.term.term_id}))
        self.assertEqual(response.status_code, 401)

    def test_get_classrooms_terms_view_not_found(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("classrooms-term", kwargs={'term': 999}))
        self.assertEqual(response.status_code, 404)


class ClassroomTermCoursesViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)
        response = self.client.post('/login/', data=self.user_data)
        self.access_token = response.data['access']
        self.building = Building.objects.create(building_name="Test Building 1", image_url="http://example.com")

        self.term = Term.objects.create(term_name="SP2024")

        self.floor = Floor.objects.create(floor_name="First Floor", building_name="Main", building=self.building)

        self.classroom_a = Classroom.objects.create(classroom_name="Classroom A", classroom_number="1", total_seats=30,
                                                    term=self.term,
                                                    floor=self.floor)

        self.course = Course.objects.create(
            classroom=self.classroom_a,
            start_time=time(9, 0),
            end_time=time(10, 30),
            instructor="Nate Williams",
            first_day=date(2021, 2, 1),
            last_day=date(2021, 5, 15),
            course_name="The best class to EVER EXIST",
            term=self.term,
            credits=3,
            course_cap=30,
            waitlist_cap=5,
            enrollment_total=25,
            course_level="400",
            monday=True,
            wednesday=True,
            friday=True
        )

    def test_get_term_classrooms_course_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(
            reverse("term-classroom-courses", kwargs={'term': self.term.term_id, 'fk': self.classroom_a.classroom_id}))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one course")

        # Define required fields including where to find nested fields
        required_top_level_fields = [
            'course_id', 'start_time', 'end_time', 'instructor', 'first_day', 'last_day',
            'course_name', 'term', 'credits', 'course_cap', 'waitlist_cap', 'waitlist_total',
            'enrollment_total', 'course_level', 'monday', 'tuesday', 'wednesday', 'thursday',
            'friday', 'saturday', 'sunday', 'classroom'
        ]

        required_classroom_fields = [
            'classroom_id', 'classroom_number', 'total_seats', 'width_of_room', 'length_of_room',
            'projectors', 'microphone_system', 'blueray_player', 'laptop_hdmi', 'zoom_camera',
            'document_camera', 'storage', 'movable_chairs', 'printer', 'piano', 'stereo_system',
            'optimization_score', 'total_tv', 'sinks', 'notes', 'floor'
        ]

        # Check each course in the response
        for course_data in response.data:
            # Check for presence of all required top-level fields
            for field in required_top_level_fields:
                self.assertIn(field, course_data, f"{field} is missing in the response data")

            # Check nested 'classroom' field separately
            classroom_data = course_data['classroom']
            for field in required_classroom_fields:
                self.assertIn(field, classroom_data, f"{field} is missing in 'classroom' data")

    def test_get_term_classrooms_course_unauthenticated(self):
        response = self.client.get(
            reverse("term-classroom-courses", kwargs={'term': self.term.term_id, 'fk': self.classroom_a.classroom_id}))
        self.assertEqual(response.status_code, 401)

    def test_get_term_classrooms_course_valid_term_invalid_classroom(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(
            reverse("term-classroom-courses", kwargs={'term': 999, 'fk': self.classroom_a.classroom_id}))
        self.assertEqual(response.status_code, 404)

    def test_get_term_classrooms_course_valid_course_invalid_classroom(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("term-classroom-courses", kwargs={'term': 999, 'fk': 20}))
        self.assertEqual(response.status_code, 404)

    def test_get_term_classrooms_course_invalid_term_invalid_classroom(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("term-classroom-courses", kwargs={'term': self.term.term_id, 'fk': 20}))
        self.assertEqual(response.status_code, 404)


class ClassroomCoursesViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)
        response = self.client.post('/login/', data=self.user_data)
        self.access_token = response.data['access']
        self.building = Building.objects.create(building_name="Test Building 1", image_url="http://example.com")

        self.term = Term.objects.create(term_name="SP2024")

        self.floor = Floor.objects.create(floor_name="First Floor", building_name="Main", building=self.building)

        self.classroom_a = Classroom.objects.create(classroom_name="Classroom A", classroom_number="1", total_seats=30,
                                                    term=self.term,
                                                    floor=self.floor)

        self.course = Course.objects.create(
            classroom=self.classroom_a,
            start_time=time(9, 0),
            end_time=time(10, 30),
            instructor="Nate Williams",
            first_day=date(2021, 2, 1),
            last_day=date(2021, 5, 15),
            course_name="The best class to EVER EXIST",
            term=self.term,
            credits=3,
            course_cap=30,
            waitlist_cap=5,
            enrollment_total=25,
            course_level="400",
            monday=True,
            wednesday=True,
            friday=True
        )

    def test_get_classrooms_course_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("classroom-courses", kwargs={'fk': self.course.course_id}))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one classroom")

        # Define required fields including where to find nested fields
        required_top_level_fields = [
            'course_id', 'start_time', 'end_time', 'instructor', 'first_day', 'last_day',
            'course_name', 'term', 'credits', 'course_cap', 'waitlist_cap', 'waitlist_total',
            'enrollment_total', 'course_level', 'monday', 'tuesday', 'wednesday', 'thursday',
            'friday', 'saturday', 'sunday', 'classroom'
        ]

        required_classroom_fields = [
            'classroom_id', 'classroom_number', 'total_seats', 'width_of_room', 'length_of_room',
            'projectors', 'microphone_system', 'blueray_player', 'laptop_hdmi', 'zoom_camera',
            'document_camera', 'storage', 'movable_chairs', 'printer', 'piano', 'stereo_system',
            'optimization_score', 'total_tv', 'sinks', 'notes', 'floor'
        ]

        # Check each course in the response
        for course_data in response.data:
            # Check for presence of all required top-level fields
            for field in required_top_level_fields:
                self.assertIn(field, course_data, f"{field} is missing in the response data")

            # Check nested 'classroom' field separately
            classroom_data = course_data['classroom']
            for field in required_classroom_fields:
                self.assertIn(field, classroom_data, f"{field} is missing in 'classroom' data")

    def test_get_classrooms_course_unauthenticated(self):
        response = self.client.get(reverse("classroom-courses", kwargs={'fk': self.course.course_id}))
        self.assertEqual(response.status_code, 401)

    def test_get_classrooms_course_view_not_found(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("classroom-courses", kwargs={'fk': 999}))
        self.assertEqual(response.status_code, 404)


class CourseViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)
        response = self.client.post('/login/', data=self.user_data)
        self.access_token = response.data['access']
        self.building = Building.objects.create(building_name="Test Building 1", image_url="http://example.com")

        self.term = Term.objects.create(term_name="SP2024")

        self.floor = Floor.objects.create(floor_name="First Floor", building_name="Main", building=self.building)

        self.classroom_a = Classroom.objects.create(classroom_name="Classroom A", classroom_number="1", total_seats=30,
                                                    term=self.term,
                                                    floor=self.floor)

        # Create multiple courses
        self.course = Course.objects.create(
            classroom=self.classroom_a, start_time=time(9, 0), end_time=time(10, 30),
            instructor="Nate Williams", first_day=date(2021, 2, 1), last_day=date(2021, 5, 15),
            course_name="The best class to EVER EXIST", term=self.term, credits=3,
            course_cap=30, waitlist_cap=5, enrollment_total=25, course_level="400",
            monday=True, wednesday=True, friday=True
        )
        self.course2 = Course.objects.create(
            classroom=self.classroom_a, start_time=time(11, 0), end_time=time(12, 30),
            instructor="Jane Doe", first_day=date(2021, 2, 1), last_day=date(2021, 5, 15),
            course_name="Another Amazing Class", term=self.term, credits=3,
            course_cap=30, waitlist_cap=5, enrollment_total=20, course_level="300",
            tuesday=True, thursday=True
        )

    def test_get_course_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get("/courses/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one course")

    def test_get_multiple_courses(self):
        self.client.force_authenticate(user=self.user)  # Authenticate the request
        response = self.client.get("/courses/")  # Use the name of your URL for listing courses
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) >= 2, "Should return at least two courses")

        # Define required fields including where to find nested fields
        required_top_level_fields = [
            'course_id', 'start_time', 'end_time', 'instructor', 'first_day', 'last_day',
            'course_name', 'term', 'credits', 'course_cap', 'waitlist_cap', 'waitlist_total',
            'enrollment_total', 'course_level', 'monday', 'tuesday', 'wednesday', 'thursday',
            'friday', 'saturday', 'sunday', 'classroom'
        ]

        required_classroom_fields = [
            'classroom_id', 'classroom_number', 'total_seats', 'width_of_room', 'length_of_room',
            'projectors', 'microphone_system', 'blueray_player', 'laptop_hdmi', 'zoom_camera',
            'document_camera', 'storage', 'movable_chairs', 'printer', 'piano', 'stereo_system',
            'optimization_score', 'total_tv', 'sinks', 'notes', 'floor'
        ]

        # Check each course in the response
        for course_data in response.data:
            # Check for presence of all required top-level fields
            for field in required_top_level_fields:
                self.assertIn(field, course_data, f"{field} is missing in the response data")

            # Check nested 'classroom' field separately
            classroom_data = course_data['classroom']
            for field in required_classroom_fields:
                self.assertIn(field, classroom_data, f"{field} is missing in 'classroom' data")

    def test_get_course_unauthenticated(self):
        response = self.client.get("/courses/")
        self.assertEqual(response.status_code, 401)

    def test_course_detail_view(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(
            reverse('courses-detail', kwargs={'pk': self.course.course_id}))
        self.assertEqual(response.status_code, 200)

        course_data = response.data

        # Define all expected fields in the response
        expected_fields = [
            'course_id', 'start_time', 'end_time', 'instructor', 'first_day', 'last_day',
            'course_name', 'term', 'credits', 'course_cap', 'waitlist_cap', 'waitlist_total',
            'enrollment_total', 'course_level', 'monday', 'tuesday', 'wednesday', 'thursday',
            'friday', 'saturday', 'sunday', 'classroom'
        ]

        # Verify that each field is present in the course data
        for field in expected_fields:
            self.assertIn(field, course_data, f"{field} is missing in the response data")

        # Ensure classroom data and its nested fields are correctly verified
        classroom_data = course_data['classroom']
        classroom_fields = [
            'classroom_id', 'classroom_number', 'total_seats', 'width_of_room', 'length_of_room',
            'projectors', 'microphone_system', 'blueray_player', 'laptop_hdmi', 'zoom_camera',
            'document_camera', 'storage', 'movable_chairs', 'printer', 'piano', 'stereo_system',
            'optimization_score', 'total_tv', 'sinks', 'notes', 'floor'
        ]

        for field in classroom_fields:
            self.assertIn(field, classroom_data, f"{field} is missing in 'classroom' data")

    def test_course_detail_view_not_found(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse('courses-detail', kwargs={'pk': 999}))
        self.assertEqual(response.status_code, 404)

    def test_get_course_detail_unauthenticated(self):
        response = self.client.get(
            reverse('courses-detail', kwargs={'pk': self.course.course_id}))
        self.assertEqual(response.status_code, 401)

    def test_get_course_term_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("term-courses", kwargs={'term': self.term.term_id}))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one course")

        # Define required fields including where to find nested fields
        required_top_level_fields = [
            'course_id', 'start_time', 'end_time', 'instructor', 'first_day', 'last_day',
            'course_name', 'term', 'credits', 'course_cap', 'waitlist_cap', 'waitlist_total',
            'enrollment_total', 'course_level', 'monday', 'tuesday', 'wednesday', 'thursday',
            'friday', 'saturday', 'sunday', 'classroom'
        ]

        required_classroom_fields = [
            'classroom_id', 'classroom_number', 'total_seats', 'width_of_room', 'length_of_room',
            'projectors', 'microphone_system', 'blueray_player', 'laptop_hdmi', 'zoom_camera',
            'document_camera', 'storage', 'movable_chairs', 'printer', 'piano', 'stereo_system',
            'optimization_score', 'total_tv', 'sinks', 'notes', 'floor'
        ]

        # Check each course in the response
        for course_data in response.data:
            # Check for presence of all required top-level fields
            for field in required_top_level_fields:
                self.assertIn(field, course_data, f"{field} is missing in the response data")

            # Check nested 'classroom' field separately
            classroom_data = course_data['classroom']
            for field in required_classroom_fields:
                self.assertIn(field, classroom_data, f"{field} is missing in 'classroom' data")

    def test_get_course_term_unauthenticated(self):
        response = self.client.get(reverse("term-courses", kwargs={'term': self.term.term_id}))
        self.assertEqual(response.status_code, 401)

    def test_get_course_invalid_term(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse("term-courses", kwargs={'term': 999}))
        self.assertEqual(response.status_code, 404)


class FloorViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)
        response = self.client.post('/login/', data=self.user_data)
        self.access_token = response.data['access']

        self.building = Building.objects.create(building_name="Main Building")
        self.floor = Floor.objects.create(floor_name="First Floor", building=self.building)
        self.floor2 = Floor.objects.create(floor_name="Second Floor", building=self.building)

    def test_get_floors_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/floors/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one floor")

        # Check that all required fields are in each floor dictionary
        required_fields = ['floor_id', 'floor_name', 'building']
        for floor in response.data:
            for field in required_fields:
                self.assertIn(field, floor, f"{field} is missing in the floor data")

            # Additional checks for nested 'building' dictionary
            building_fields = ['building_id', 'building_name', 'image_url']
            for b_field in building_fields:
                self.assertIn(b_field, floor['building'], f"{b_field} is missing in the building data")

    def test_get_floors_unauthenticated(self):
        response = self.client.get('/floors/')
        self.assertEqual(response.status_code, 401)

    def test_get_floors_detail_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse('floor-detail', kwargs={'pk': self.floor.floor_id}))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one floor")

        # Validate fields in the detailed floor response
        required_fields = ['floor_id', 'floor_name', 'building']
        for field in required_fields:
            self.assertIn(field, response.data, f"{field} is missing in the floor detail data")

        # Check nested building fields
        building_fields = ['building_id', 'building_name', 'image_url']
        for b_field in building_fields:
            self.assertIn(b_field, response.data['building'], f"{b_field} is missing in the building data")

    def test_get_floor_detail_view_not_found(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse('floor-detail', kwargs={'pk': 999}))
        self.assertEqual(response.status_code, 404)

    def test_get_floors_detail_unauthenticated(self):
        response = self.client.get(reverse('floor-detail', kwargs={'pk': self.floor.floor_id}))
        self.assertEqual(response.status_code, 401)


class TermViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)
        response = self.client.post('/login/', data=self.user_data)
        self.access_token = response.data['access']
        self.term1 = Term.objects.create(term_name="SP2024")
        self.term2 = Term.objects.create(term_name="FA2023")

    def test_get_terms_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/terms/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one term")
        required_fields = ['term_name']

        for term in response.data:
            for field in required_fields:
                self.assertIn(field, term, f"{field} is missing in the term data")

    def test_get_terms_unauthenticated(self):
        response = self.client.get('/terms/')
        self.assertEqual(response.status_code, 401)


class TestLoadView(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create and authenticate user
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test_user',
            'password': 'test_password',
        }
        self.user = get_user_model().objects.create_user(**self.user_data)
        response = self.client.post('/login/', data=self.user_data)

        self.access_token = response.data['access']  # Assuming token key is 'token'
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    @patch('roomschedulerapi.views.logger')
    def test_post_load_data_valid(self, mock_logger):
        # Setup Mocks
        with open('roomschedulerapi/Sample_Excel_Upload.xlsx', 'rb') as fp:
            request_data = {'file': File(fp)}
            # Execute
            response = self.client.post(reverse("load"), request_data, format='multipart')
            # Assertions
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.data, "Data reader has processed new term data")

            # Check logger messages
            mock_logger.info.assert_any_call(f"User uploaded new term data - User: {self.user.username}")
            mock_logger.info.assert_any_call(f"Data reader sorted data for - User: {self.user.username}")
            mock_logger.info.assert_any_call(f"Data reader loaded data into database - User: {self.user.username}")

        # Check the import of a term worked
        response = self.client.get("/courses/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) >= 2, "Should return at least two courses")

        # Define required fields including where to find nested fields
        required_top_level_fields = [
            'course_id', 'start_time', 'end_time', 'instructor', 'first_day', 'last_day',
            'course_name', 'term', 'credits', 'course_cap', 'waitlist_cap', 'waitlist_total',
            'enrollment_total', 'course_level', 'monday', 'tuesday', 'wednesday', 'thursday',
            'friday', 'saturday', 'sunday', 'classroom'
        ]

        required_classroom_fields = [
            'classroom_id', 'classroom_number', 'total_seats', 'width_of_room', 'length_of_room',
            'projectors', 'microphone_system', 'blueray_player', 'laptop_hdmi', 'zoom_camera',
            'document_camera', 'storage', 'movable_chairs', 'printer', 'piano', 'stereo_system',
            'optimization_score', 'total_tv', 'sinks', 'notes', 'floor'
        ]

        # Check each course in the response
        for course_data in response.data:
            # Check for presence of all required top-level fields
            for field in required_top_level_fields:
                self.assertIn(field, course_data, f"{field} is missing in the response data")

            # Check nested 'classroom' field separately
            classroom_data = course_data['classroom']
            for field in required_classroom_fields:
                self.assertIn(field, classroom_data, f"{field} is missing in 'classroom' data")

    @patch('roomschedulerapi.views.logger')
    def test_post_load_data_invalid(self, mock_logger):
        # Setup Mocks
        with open('roomschedulerapi/Sample_Excel_Invalid.xlsx', 'rb') as fp:
            request_data = {'file': File(fp)}
            # Execute
            response = self.client.post(reverse("load"), request_data, format='multipart')
            # Assertions
            self.assertEqual(response.status_code, 422)
            self.assertEqual(response.data, {'error': 'This is not a valid file.'})

            # Check logger messages
            mock_logger.warning.assert_any_call(f"User failed to upload new term data - User: {self.user.username}")
