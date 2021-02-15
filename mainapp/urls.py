from django.urls import path
from .views import *

urlpatterns = [
    path('login/',LoginUser.as_view() ),
    path('logout/',LogoutUser.as_view() ),
    path('register/',RegisterUser.as_view() ),
    path('eventsview/',EventView.as_view() ),
    path('trainview/',TrainView.as_view() ),
    path('verifyview/',VerifyView.as_view() ),
    path('authenticatedview/<slug>/',AuthenticatedView.as_view() ),
    path('subeventsview/<slug>/',SubeventView.as_view() ),
    path('subeventsview/person/<slug>/',PersonView.as_view() ),


]
