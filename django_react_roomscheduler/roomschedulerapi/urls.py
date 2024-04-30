from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.views.generic import TemplateView
from .views import DefaultView, RegisterView, BuildingView, FloorView, ClassroomView, CourseView, \
     BuildingDetailView, FloorDetailView, CourseDetailView, ClassroomDetailView, LoadView, LoginView, LogoutView, \
     ClassroomCoursesView, ClassroomCoursesTermView, CoursesTermView, TermView, ClassroomTermView, UpdatePasswordView, \
     AdminUpdatePasswordView

urlpatterns = [
     ## INDEX ENDPOINT
     path('', DefaultView.as_view()),

     ## AUTH ENDPOINTS
     path('login/',
          LoginView.as_view(),
          name ='token_obtain_pair'),
     path('login/refresh/',
          jwt_views.TokenRefreshView.as_view(),
          name ='token_refresh'),
     path('register/', RegisterView.as_view(), name='register'),
     path('logout/', LogoutView.as_view()),

     ## APPLICATION ENDPOINTS
     path('updatePassword/', UpdatePasswordView.as_view(), name='updatePassword'),
     path('adminUpdatePassword/', AdminUpdatePasswordView.as_view(), name='adminUpdatePassword'),
     path('buildings/', BuildingView.as_view(), name='buildings'),
     path('buildings/<int:pk>/', BuildingDetailView.as_view(), name='building-detail'),

     path('floors/', FloorView.as_view(), name='floors'),
     path('floors/<int:pk>/', FloorDetailView.as_view(), name='floor-detail'),


     path('classrooms/', ClassroomView.as_view(), name='classrooms'),
     path('classrooms/<int:pk>/', ClassroomDetailView.as_view(), name='classrooms-detail'),
     path('<int:term>/classrooms/', ClassroomTermView.as_view(), name='classrooms-detail'),

     path('courses/', CourseView.as_view(), name='courses'),
     path('courses/<int:pk>/', CourseDetailView.as_view(), name='courses-detail'),
     path('<str:term>/courses/', CoursesTermView.as_view(), name='term-courses'),

     path('classroom-courses/<int:fk>/', ClassroomCoursesView.as_view(), name='classroom-courses'),
     path('<str:term>/classroom-courses/<int:fk>/', ClassroomCoursesTermView.as_view(), name='term-classroom-courses'),

     path('terms/', TermView.as_view(), name='term-classroom-courses'),
     path('load/', LoadView.as_view(), name='load')

]
