from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Event)
admin.site.register(Subevent)
admin.site.register(Person)
admin.site.register(Authenticated)
