"""
URL configuration for djangosettings project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.views.generic import TemplateView
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

from roomschedulerapi.views import DefaultView, IndexView

# Schema view setup
schema_view = get_schema_view(
    openapi.Info(
        title="Room Scheduler API",
        default_version='v1',
        description="Documentation of API endpoints for the Room Scheduler application",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('', TemplateView.as_view(template_name='index.html')),
                  path('', DefaultView.as_view()),
                  path('register', IndexView.as_view()),
                  path('login', IndexView.as_view()),
                  path('dashboard', IndexView.as_view()),
                  path('api/', include('roomschedulerapi.urls')),
                  path('updatePassword/', IndexView.as_view()),
                  path('adminUpdatePassword/', IndexView.as_view()),
                  # API schema and documentation routes
                  re_path(r'^api/docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
