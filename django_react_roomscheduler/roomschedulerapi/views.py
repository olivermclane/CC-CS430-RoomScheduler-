import os

from django.contrib.auth import get_user_model, logout
from django.contrib.auth.models import AnonymousUser
from django.shortcuts import render
from rest_framework import status, permissions
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
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        logger.info(f"User requested index page - User: {request.data.get('email')} - Body: {request.data.get('body')}")
        return render(request, 'index.html')

class IndexView(APIView):
    def get(self, request):
        logger.info(f"User requested index page - User: {request.data.get('email')} - Body: {request.data.get('body')}")
        return render(request, 'index.html')

class LogoutView(APIView):
    def post(self, request):
        # Blacklist the current token
        if request.auth and hasattr(request.auth, 'get_token'):
            token = request.auth.get_token()
            logger.info(
                f"User logged out. Blacklisted access token - User: {request.data.get('email')} - Body: {request.data.get('body')}")
        logout(request)
        return Response({"message": "Successfully logged out"})


class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        logger.info(f"Login attempt for user: {request.data.get('email')}")
        response = super().post(request, *args, **kwargs)  # Generate tokens first

        # Access user data after token generation
        try:
            user = get_user_model().objects.get(email=request.data['email'])
            user_data = {
                'username': user.username,
                'email': user.email,
            }
            logger.info(f"Successful login for user: {request.data.get('email')}")

            response.data.update(user_data)  # Include user data in response
        except KeyError:
            # Handle cases where email is not found (e.g., invalid credentials)
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        return response


class RegisterView(APIView):
    permission_classes = (AllowAny,)
    queryset = User.objects.all()

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        logger.info(f"User {request.data.get('email')} attempted to register")
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = serializer.instance
        refresh = RefreshToken.for_user(user)
        logger.info(f"User {request.data.get('email')} register")
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class BuildingView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        # Retrieve buildings data for authenticated user
        buildings = Building.objects.all()
        logger.info(f"Buildings accessed by {request.user.username}{request.user.email}")
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)


class BuildingDetailView(APIView):
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
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        # Retrieve buildings data for authenticated user
        courses = Course.objects.all()
        logger.info(f"Courses accessed by {request.user.username}")

        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


class CourseDetailView(APIView):
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
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        classrooms = Classroom.objects.all()
        logger.info(f"Classrooms  accessed by {request.user.username}")

        serializer = ClassroomSerializer(classrooms, many=True)
        return Response(serializer.data)


class ClassroomDetailView(APIView):
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
    permission_classes = (IsAuthenticated,)

    def get(self, request, term):
        classrooms = Classroom.objects.filter(term=term)
        if not classrooms:
            return Response({'error': 'Classroom Term not found.'}, status=404)
        logger.info(f"Classrooms Term {term}  accessed by {request.user.username}")
        serializer = ClassroomSerializer(classrooms, many=True)
        return Response(serializer.data)


class FloorView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        floors = Floor.objects.all()
        logger.info(f"Floors accessed by {request.user.username}")
        serializer = FloorSerializer(floors, many=True)
        return Response(serializer.data)


class FloorDetailView(APIView):
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
    permission_classes = (IsAuthenticated,)

    def get(self, request, fk):
        courses = Course.objects.filter(classroom_id=fk)
        if not courses.exists():
            return Response({'error': 'No courses found for the specified classroom and term.'}, status=404)
        serializer = ClassroomCourseSerializer(courses, many=True)
        logger.info(f"Classroom Courses accessed by {request.user.username}")
        return Response(serializer.data)

class TermView(APIView):
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
    permission_classes = (IsAuthenticated,)

    def get(self, request, term):
        classroomCourseTerm = Course.objects.filter(term=term)
        if not classroomCourseTerm.exists():
            return Response({'error': 'No courses found for the specified term.'}, status=404)
        serializer = ClassroomCourseSerializer(classroomCourseTerm, many=True)
        logger.info(f"Courses for term accessed by {request.user.username}")
        return Response(serializer.data)



class ClassroomCoursesTermView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, term, fk):
        courses = Course.objects.filter(classroom_id=fk, term_id=term)
        if not courses.exists():
            return Response({'error': 'No courses found for the specified classroom and term.'}, status=404)

        serializer = CourseSerializer(courses, many=True)
        logger.info(f"Classroom courses for term: {courses} accessed by {request.user.username}")
        return Response(serializer.data)


class LoadView(APIView):
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
    # permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.user is AnonymousUser:
            return Response({'error': 'Cannot post log'}, status=401)
        try:
            # Extract the log event from the request data
            log_event = request.data
            # Write the log event to a log file
            with open('django_debug.log', 'a') as file:
                file.write(str(log_event) + '\n')
            # Return a success response
            return Response({"message": "Log was written"}, status=200)
        except Exception as e:
            # Handle any exceptions that occur during processing
            return Response({"error": str(e)}, status=500)


class DownloadExampleExcel(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        file_path = "roomschedulerapi/Sample_Excel_Upload.xlsx"
        if not os.path.exists(file_path):
            return Response("File not found", status=404)
        try:
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename='example.xlsx')
        except Exception as e:
            return Response(f"Error: {e}", status=500)