from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.views.generic import TemplateView
from .views import DefaultView, RegisterView, BuildingView, FloorView, ClassroomView, CourseView, \
     BuildingDetailView, FloorDetailView, CourseDetailView, ClassroomDetailView, LoadView, LoginView, LogoutView, \
     ClassroomCoursesView, ClassroomCoursesTermView, CoursesTermView, TermView, ClassroomTermView

urlpatterns = [
     ## INDEX ENDPOINT
     path('', DefaultView.as_view()),

     ## AUTH ENDPOINTS
     path('login/',
          LoginView.as_view(),
          name ='token_obtain_pair'),#Tested
     path('login/refresh/',
          jwt_views.TokenRefreshView.as_view(),
          name ='token_refresh'),
     path('register/', RegisterView.as_view(), name='register'), #Tested
     path('logout/', LogoutView.as_view(), name='logout'), #Tested

     ## APPLICATION ENDPOINTS
     path('buildings/', BuildingView.as_view(), name='buildings'), #Tested
     path('buildings/<int:pk>/', BuildingDetailView.as_view(), name='building-detail'), #Tested

     path('floors/', FloorView.as_view(), name='floors'), #Tested
     path('floors/<int:pk>/', FloorDetailView.as_view(), name='floor-detail'), #Tested


     path('classrooms/', ClassroomView.as_view(), name='classrooms'), # Tested
     path('classrooms/<int:pk>/', ClassroomDetailView.as_view(), name='classrooms-detail'),# Tested
     path('<int:term>/classrooms/', ClassroomTermView.as_view(), name='classrooms-term'), # Tested

     path('courses/', CourseView.as_view(), name='courses'),# Tested
     path('courses/<int:pk>/', CourseDetailView.as_view(), name='courses-detail'), # Tested
     path('<str:term>/courses/', CoursesTermView.as_view(), name='term-courses'), # Tested

     path('classroom-courses/<int:fk>/', ClassroomCoursesView.as_view(), name='classroom-courses'), #Tested
     path('<str:term>/classroom-courses/<int:fk>/', ClassroomCoursesTermView.as_view(), name='term-classroom-courses'), #Tested

     path('terms/', TermView.as_view(), name='term-classroom-courses'), # Tested
     path('load/', LoadView.as_view(), name='load')
]
