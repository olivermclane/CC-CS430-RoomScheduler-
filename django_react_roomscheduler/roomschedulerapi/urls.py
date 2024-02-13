from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.views.generic import TemplateView
from .views import DefaultView, RegisterView, LoginView, BuildingView, FloorView, ClassroomView, CourseView


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
     path('floors/', FloorView.as_view(), name='floors'),
     path('courses/', CourseView.as_view(), name='courses'),
     path('classrooms/', ClassroomView.as_view(), name='classrooms')

]