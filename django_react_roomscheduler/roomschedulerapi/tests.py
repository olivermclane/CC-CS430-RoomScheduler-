from datetime import time, date

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
        self.user = self.user_model.objects.create_user(username='testuser', email='test@example.com', password='testpassword123')
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

    def test_get_buildings_unauthenticated(self):
        response = self.client.get("/buildings/")
        self.assertEqual(response.status_code, 401, "Should return 401 for unauthenticated access")

    def test_building_detail_view(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse('building-detail', kwargs={'pk': self.building.building_id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['building_name'], "Test Building 1")
        self.assertEqual(response.data['image_url'], "http://example.com/img1.jpg")
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

    def test_get_classrooms_unauthenticated(self):
        response = self.client.get('/classrooms/')
        self.assertEqual(response.status_code, 401)

    def test_classroom_detail_view(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(
            reverse('classrooms-detail', kwargs={'pk': self.classroom.classroom_id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['classroom_number'], self.classroom.classroom_number)

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

    def test_get_course_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get("/courses/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one course")

    def test_get_course_unauthenticated(self):
        response = self.client.get("/courses/")
        self.assertEqual(response.status_code, 401)

    def test_course_detail_view(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(
            reverse('courses-detail', kwargs={'pk': self.course.course_id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['course_id'], self.course.course_id)

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

    def test_get_floors_unauthenticated(self):
        response = self.client.get('/floors/')
        self.assertEqual(response.status_code, 401)

    def test_get_floors_detail_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(reverse('floor-detail', kwargs={'pk': self.floor.floor_id}))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one floor")

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
        self.term = Term.objects.create(term_name="SP2024")

    def test_get_terms_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get('/terms/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.data) > 0, "Should return at least one floor")

    def test_get_terms_unauthenticated(self):
        response = self.client.get('/terms/')
        self.assertEqual(response.status_code, 401)
