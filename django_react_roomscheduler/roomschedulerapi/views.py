import os

from django.contrib.auth import get_user_model, logout
from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import FileResponse
from pathlib import Path

import logging

logger = logging.getLogger("django_react_roomscheduler")

from .DataReader.dataReader import DataReader
from .models import Building, Floor, Classroom, Course, User, Term
from .serializers import BuildingSerializer, FloorSerializer, ClassroomSerializer, CourseSerializer, UserSerializer, \
    ClassroomCourseSerializer, TermSerializer


class DefaultView(APIView):
    """
    get:
    Returns the main index page to authenticated users.

    Requires authentication.
    """

    def get(self, request):
        logger.info(f"User requested index page - User: {request.data.get('email')} - Body: {request.data.get('body')}")
        return render(request, 'index.html')


class IndexView(APIView):
    """
    get:
    Provides the index page without requiring user authentication.
    """

    def get(self, request):
        logger.info(f"User requested index page - User: {request.data.get('email')} - Body: {request.data.get('body')}")
        return render(request, 'index.html')

class LogoutView(APIView):
    """
    post:
    Logs out the user by invalidating the user's authentication token.

    Requires authentication and the request must include a valid token.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # Blacklist the current token
        if request.auth and hasattr(request.auth, 'get_token'):
            if request.auth and hasattr(request.auth, 'get_token'):
                token = request.auth.get_token()
                logger.info(
                    f"User logged out. Blacklisted access token - User: {request.data.get('email')} - Body: {request.data.get('body')}")
        logout(request)
        return Response({"message": "Successfully logged out"})


class LoginView(TokenObtainPairView):
    """
    post:
    Authenticates a user and returns a JWT token pair (access and refresh).

    Accepts email and password. Returns the token pair along with user basic information if authentication is successful.
    """
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        logger.info(f"Login attempt for user: {request.data.get('email')}")
        response = super().post(request, *args, **kwargs)

        # Access user data after token generation
        try:
            user = get_user_model().objects.get(email=request.data['email'])
            user_data = {
                'username': user.username,
                'email': user.email,
            }
            logger.info(f"Successful login for user: {request.data.get('email')}")

            response.data.update(user_data)
        except KeyError:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        return response


class RegisterView(APIView):
    """
    post:
    Registers a new user with the provided details.

    Requires email, username, password, and other necessary user details. Returns the JWT refresh and access tokens upon successful registration.
    """

    permission_classes = (AllowAny,)
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        try:
            serializer = UserSerializer(data=request.data)
            logger.info(f"Attempting to register user with email: {request.data.get('email')}")
            serializer.is_valid(raise_exception=True)
            serializer.save()
            user = serializer.instance
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        except Exception as e:
            logger.error(f"Error during user registration: {str(e)}")
            return Response({'detail': str(e)}, status=400)


class BuildingView(APIView):
    """
    get:
    Retrieves a list of all buildings available in the database.

    Requires user authentication. Returns a list of building details including names, and other related information.
    Only accessible to authenticated users.

    Error Response:
        - 401: Returned if no refresh token is provided.

    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        # Retrieve buildings data for authenticated user
        buildings = Building.objects.all()
        logger.info(f"Buildings accessed by {request.user.username}{request.user.email}")
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)


class BuildingDetailView(APIView):
    """
    get:
    Retrieves detailed information about a specific building identified by its ID.

    Requires user authentication. This endpoint is used to fetch detailed information about a building,
    such as its name, and associated floors or rooms. If the building with the specified ID does not exist,
    a 404 error is returned.

    Path Parameter:
    - pk (int): Primary key of the building to retrieve.

    Error Response:
    - 404: Returned if no building with the provided ID could be found.
    - 401: Returned if no refresh token is provided.

    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        try:
            building = Building.objects.get(building_id=pk)
            logger.info(f"Building accessed by {request.user.username}")
            serializer = BuildingSerializer(building)
            return Response(serializer.data)
        except Building.DoesNotExist:
            return Response({'error': 'Building not found'}, status=404)


class CourseView(APIView):
    """
    get:
    Retrieves a list of courses.

    Requires user authentication. This endpoint is used to fetch a list of all available courses.
    If no courses are found, an empty array is returned.

    Error Response:
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        courses = Course.objects.all()
        logger.info(f"Courses accessed by {request.user.username}")

        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


class CourseDetailView(APIView):
    """
    get:
    Retrieves detailed information about a specific course identified by its ID.

    Requires user authentication. This endpoint is used to fetch detailed information about a course,
    such as its name and description. If the course with the specified ID does not exist,
    a 404 error is returned.

    Path Parameter:
    - pk (int): Primary key of the course to retrieve.

    Error Response:
    - 404: Returned if no course with the provided ID could be found.
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        try:
            course = Course.objects.get(course_id=pk)
            logger.info(f"Course accessed by {request.user.username}")
            serializer = CourseSerializer(course)
            return Response(serializer.data)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=404)


class ClassroomView(APIView):
    """
    get:
    Retrieves a list of classrooms.

    Requires user authentication. This endpoint is used to fetch a list of all available classrooms.
    If no classrooms are found, an empty array is returned.

    Error Response:
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        classrooms = Classroom.objects.all()
        logger.info(f"Classrooms accessed by {request.user.username}")

        serializer = ClassroomSerializer(classrooms, many=True)
        return Response(serializer.data)


class ClassroomDetailView(APIView):
    """
    get:
    Retrieves detailed information about a specific classroom identified by its ID.

    Requires user authentication. This endpoint is used to fetch detailed information about a classroom,
    such as its name and capacity. If the classroom with the specified ID does not exist,
    a 404 error is returned.

    Path Parameter:
    - pk (int): Primary key of the classroom to retrieve.

    Error Response:
    - 404: Returned if no classroom with the provided ID could be found.
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        try:
            classroom = Classroom.objects.get(classroom_id=pk)
            logger.info(f"Classroom accessed by {request.user.username}")

            serializer = ClassroomSerializer(classroom)
            return Response(serializer.data)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=404)


class ClassroomTermView(APIView):
    """
    get:
    Retrieves a list of classrooms for a specific term.

    Requires user authentication. This endpoint is used to fetch a list of classrooms available for a specific term.
    If no classrooms are found for the specified term, a 404 error is returned.

    Path Parameter:
    - term (str): Term for which classrooms are to be retrieved.

    Error Response:
    - 404: Returned if no classrooms are found for the specified term.
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, term):
        classrooms = Classroom.objects.filter(term=term)
        if not classrooms:
            return Response({'error': 'Classroom Term not found.'}, status=404)
        logger.info(f"Classrooms Term {term}  accessed by {request.user.username}")
        serializer = ClassroomSerializer(classrooms, many=True)
        return Response(serializer.data)


class FloorView(APIView):
    """
    get:
    Retrieves a list of floors.

    Requires user authentication. This endpoint is used to fetch a list of all available floors.
    If no floors are found, an empty array is returned.

    Error Response:
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        floors = Floor.objects.all()
        logger.info(f"Floors accessed by {request.user.username}")
        serializer = FloorSerializer(floors, many=True)
        return Response(serializer.data)


class FloorDetailView(APIView):
    """
    get:
    Retrieves detailed information about a specific floor identified by its ID.

    Requires user authentication. This endpoint is used to fetch detailed information about a floor,
    such as its name and associated building. If the floor with the specified ID does not exist,
    a 404 error is returned.

    Path Parameter:
    - pk (int): Primary key of the floor to retrieve.

    Error Response:
    - 404: Returned if no floor with the provided ID could be found.
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        try:
            floor = Floor.objects.get(floor_id=pk)
            logger.info(f"Floor accessed by {request.user.username}{floor.floor_name}{floor.building_name}")
            serializer = FloorSerializer(floor)
            return Response(serializer.data)
        except Floor.DoesNotExist:
            return Response({'error': 'Floor not found'}, status=404)


class ClassroomCoursesView(APIView):
    """
    get:
    Retrieves a list of courses for a specific classroom.

    Requires user authentication. This endpoint is used to fetch a list of courses available in a specific classroom.
    If no courses are found for the specified classroom, a 404 error is returned.

    Path Parameter:
    - fk (int): Foreign key of the classroom for which courses are to be retrieved.

    Error Response:
    - 404: Returned if no courses are found for the specified classroom.
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, fk):
        courses = Course.objects.filter(classroom_id=fk)
        if not courses.exists():
            return Response({'error': 'No courses found for the specified classroom and term.'}, status=404)
        serializer = ClassroomCourseSerializer(courses, many=True)
        logger.info(f"Classroom Courses accessed by {request.user.username}")
        return Response(serializer.data)


class TermView(APIView):
    """
    get:
    Retrieves a list of terms.

    Requires user authentication. This endpoint is used to fetch a list of all available terms.
    If no terms are found, an empty array is returned.

    Error Response:
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):

        try:
            terms = Term.objects.all()
            serializer = TermSerializer(terms, many=True)
            logger.info(f"Term accessed by {request.user.username}")
            return Response(serializer.data)
        except Floor.DoesNotExist:
            return Response({'error': 'Classroom and course combination not found'}, status=404)


class CoursesTermView(APIView):
    """
    get:
    Retrieves a list of courses for a specific term.

    Requires user authentication. This endpoint is used to fetch a list of courses available for a specific term.
    If no courses are found for the specified term, a 404 error is returned.

    Path Parameter:
    - term (str): Term for which courses are to be retrieved.

    Error Response:
    - 404: Returned if no courses are found for the specified term.
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, term):
        classroomCourseTerm = Course.objects.filter(term=term)
        if not classroomCourseTerm.exists():
            return Response({'error': 'No courses found for the specified term.'}, status=404)
        serializer = ClassroomCourseSerializer(classroomCourseTerm, many=True)
        logger.info(f"Courses for term accessed by {request.user.username}")
        return Response(serializer.data)


class ClassroomCoursesTermView(APIView):
    """
    get:
    Retrieves a list of courses for a specific classroom and term.

    Requires user authentication. This endpoint is used to fetch a list of courses available for a specific classroom and term.
    If no courses are found for the specified classroom and term, a 404 error is returned.

    Path Parameters:
    - term (str): Term for which courses are to be retrieved.
    - fk (int): Foreign key of the classroom for which courses are to be retrieved.

    Error Response:
    - 404: Returned if no courses are found for the specified classroom and term.
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, term, fk):
        courses = Course.objects.filter(classroom_id=fk, term_id=term)
        if not courses.exists():
            return Response({'error': 'No courses found for the specified classroom and term.'}, status=404)

        serializer = CourseSerializer(courses, many=True)
        logger.info(f"Classroom courses for term: {courses} accessed by {request.user.username}")
        return Response(serializer.data)


class LoadView(APIView):
    """
    post:
    Process and load data from an uploaded file.

    Requires user authentication. This endpoint is used to process and load data from an uploaded file.
    The uploaded file is expected to be in a specific format, and the data is processed and loaded into the database.
    A success response is returned upon successful processing and loading of the data.

    Request Body:
    - file: The uploaded file containing data to be processed and loaded.

    Error Response:
    - 401: Returned if no refresh token is provided.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        dr = DataReader(request.data['file'])
        if not dr.sortData():
            logger.warning(f"User failed to upload new term data - User: {request.user.username}")
            return Response({'error': 'This is not a valid file.'}, status=422)

        logger.info(f"User uploaded new term data - User: {request.user.username}")
        logger.info(f"Data reader sorted data for - User: {request.user.username}")
        dr.loadData()
        logger.info(f"Data reader loaded data into database - User: {request.user.username}")
        return Response("Data reader has processed new term data", status=201)


class PostLogView(APIView):
    """
    post:
    Receives and processes log events.

    This endpoint is used to receive log events and process them by writing them to a log file.
    A success response is returned upon successful processing of the log event.

    Request Body:
    - log_event: The log event to be processed.

    Error Response:
    - 500: Returned if an error occurs during processing of the log event.
    - 401: Returned if no refresh token is provided. (Needs implementation)
    """

    def post(self, request):
        try:
            # Extract the log event from the request data
            log_event = request.data  # Assuming log events are sent as JSON data in the request body
            # Write the log event to a log file
            with open('../django_debug.log', 'a') as file:
                file.write(str(log_event) + '\n')
            # Return a success response
            return Response({"message": "Log event received and processed successfully"}, status=200)
        except Exception as e:
            # Handle any exceptions that occur during processing
            return Response({"error": str(e)}, status=500)


class DownloadExampleExcel(APIView):
    """
    get:
    Downloads an example Excel file.

    This endpoint is used to download an example Excel file.
    If the file is not found, a 404 error is returned.
    If an error occurs during the download process, a 500 error is returned.

    Error Response:
    - 404: Returned if the file is not found.
    - 500: Returned if an error occurs during the download process.
    """

    def get(self, request):
        file_path = "roomschedulerapi/Sample_Excel_Upload.xlsx"
        if not os.path.exists(file_path):
            return Response("File not found", status=404)
        try:
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename='example.xlsx')
        except Exception as e:
            return Response(f"Error: {e}", status=500)
