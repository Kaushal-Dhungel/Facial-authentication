from rest_framework import serializers
from .models import *

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"   

class SubEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subevent
        fields = "__all__"

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = "__all__"   

class AuthenticatedSerializer(serializers.ModelSerializer):
    get_name = serializers.ReadOnlyField()
    get_img = serializers.ReadOnlyField()
    class Meta:
        model = Authenticated
        fields = "__all__"
