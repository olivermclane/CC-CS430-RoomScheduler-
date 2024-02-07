from django.contrib import admin

# Register your models here.
from .models import Course
from .models import Classroom
from .models import Floor
from .models import Building

admin.site.register(Course)
admin.site.register(Classroom)
admin.site.register(Floor)
admin.site.register(Building)

