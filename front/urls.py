from django.urls import path,re_path
from .views import *
from django.conf import settings
react_routes = getattr(settings, 'REACT_ROUTES', [])

urlpatterns = [
    path('',index, name = 'index'),
]

for route in react_routes:
    urlpatterns += [
        path(f'{route}',index, name = 'index'),
    ]
