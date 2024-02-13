from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.views.generic import TemplateView
from .views import DefaultView, RegisterView, BuildingView, FloorView, ClassroomView, CourseView, \
     BuildingDetailView, FloorDetailView, CourseDetailView, ClassroomDetailView

urlpatterns = [
     ## INDEX ENDPOINT
     path('', DefaultView.as_view()),

     ## AUTH ENDPOINTS
     path('login/',
          jwt_views.TokenObtainPairView.as_view(),
          name ='token_obtain_pair'),
     path('login/refresh/',
          jwt_views.TokenRefreshView.as_view(),
          name ='token_refresh'),
     path('register/', RegisterView.as_view(), name='register'),

     ## APPLICATION ENDPOINTS
     path('buildings/', BuildingView.as_view(), name='buildings'),
     path('buildings/<int:pk>/', BuildingDetailView.as_view(), name='building-detail'),

     path('floors/', FloorView.as_view(), name='floors'),
     path('floors/<int:pk>/', FloorDetailView.as_view(), name='building-detail'),

     path('courses/', CourseView.as_view(), name='courses'),
     path('courses/<int:pk>/', CourseDetailView.as_view(), name='building-detail'),

     path('classrooms/', ClassroomView.as_view(), name='classrooms'),
     path('classrooms/<int:pk>/', ClassroomDetailView.as_view(), name='building-detail'),

]
