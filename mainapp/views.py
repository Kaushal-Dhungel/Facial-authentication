from .models import *
from rest_framework.views import APIView
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.http import Http404
from rest_framework import status
from django.db import IntegrityError
from django.contrib.auth.models import User,auth
from django.contrib.auth import authenticate,logout
import json
import requests
import numpy as np
# Create your views here.

class LoginUser(APIView):

    def post(self,request,*args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = auth.authenticate(username=username,password=password)

        if user is not None:
            auth.login(request,user)
            return Response({"Login Successful"},status= status.HTTP_200_OK)
        
        else:
            return Response({"Invalid Credentials. Please Try Again."},status=status.HTTP_400_BAD_REQUEST)

class LogoutUser(APIView):
    def get(self,request,*args, **kwargs):
        try:
            logout(request)
            return Response({"Logout Successful"},status= status.HTTP_200_OK)
        except Exception as e:
            # print(e)
            return Response({"Unknown Error Occured"},status=status.HTTP_400_BAD_REQUEST)
        

class RegisterUser(APIView):

    def post(self,request,*args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password1 = request.data.get('password1')
        password2 = request.data.get('password2')


        if password1 != password2:
            return Response({"Your password1 and password2 didn't match"},status=status.HTTP_400_BAD_REQUEST)

        else:
            if len(password1) < 8:
                return Response({"Your password must be atleast 8 characters long"},status=status.HTTP_400_BAD_REQUEST)
            
            try:
                user = User.objects.create_user(username, email, password1)
                user.save()

                #  login directly
                auth.login(request,user)
                return Response({"user created"},status= status.HTTP_201_CREATED)
            
            except IntegrityError:
                return Response({'Username Already Exists. Please Try New Username'},status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                # print(e)
                # print(e.__class__.__name__)
                return Response({"Unknown Error Occured. Please Try Later"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EventView(APIView):
    pagination_class = PageNumberPagination
    def get(self,request,*args, **kwargs):
        try:
            data = Event.objects.filter(user = request.user.id)
            serializer = EventSerializer(data,many = True)
            return Response(serializer.data)
        
        except Exception as e :
            # print(e)
            return Response({"data not found"})

    def post(self,request,*args,**kwargs):

        name = request.data['event']
        user = User.objects.get(id = request.user.id)

        mydict = {
            'user': request.user.id,
            'name': request.data['event'],
            'slug': "abc"
        }

        try:
            serializer = EventSerializer(data = mydict)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response({"saving failed"})


class SubeventView(APIView):

    def get(self,request,*args, **kwargs):
        slug = kwargs['slug']
        event = Event.objects.get(slug= slug)
        try:
            data = Subevent.objects.filter(event=event)
            serializer = SubEventSerializer(data,many = True)
            return Response(serializer.data)
        
        except Exception as e :
            return Response({"data not found"})

    def post(self,request,*args,**kwargs):

        name = request.data['subevent']
        slug = request.data['slug']
        event = Event.objects.get(slug= slug)

        mydict = {
            'event': event.id,
            's_name': name,
            'slug': "abc"
        }

        try:
            serializer = SubEventSerializer(data = mydict)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response({"saving failed"})

class PersonView(APIView):

    def get(self,request,*args, **kwargs):
        slug = kwargs['slug']
        event = Event.objects.get(slug= slug)
        try:
            data = Person.objects.filter(event_name=event)
            # print(data)
            serializer = PersonSerializer(data,many = True)
            return Response(serializer.data)
        
        except Exception as e :
            print(e)
            return Response({"data not found"})

class TrainView(APIView):

    def post(self,request,*args, **kwargs):
        name = request.data['name']
        img = request.data['img']
        slug = request.data['slug']

        # this url is the url of facenet API
        url = 'http://527a69d92527.ngrok.io'
        
        files = {'image': img}
        try:
            data = requests.post(url,files = files)
            if len(data.json()['embd']) == 0:
                return Response({"no face detected in the pic."}, status= status.HTTP_400_BAD_REQUEST)
            
            embeddings = json.dumps(data.json()['embd'])

            event = Event.objects.get(slug= slug)
            new_person = Person.objects.create(event_name = event,p_name = name, image = img, encodings = embeddings)
            new_person.save()
            return Response({"training successful"},status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"training failed"},status=status.HTTP_400_BAD_REQUEST)


class VerifyView(APIView):
    def post(self,request,*args, **kwargs):
        img = request.data['img']
        slug = request.data['slug']

        # this url is the url of facenet API
        url = 'http://527a69d92527.ngrok.io'
        files = {'image': img}
        try:
            event = Event.objects.get(sevent__slug = slug) # sevent is a related name
            subevent = Subevent.objects.get(slug= slug)

            data = requests.post(url,files = files)
            if len(data.json()['embd']) == 0:
                return Response({"no face detected in the pic."}, status= status.HTTP_400_BAD_REQUEST)

            list_embd = data.json()['embd']
            # get all the person from the event
            persons = Person.objects.filter(event_name = event)

            # loop over the dict
            data = []
            for person in persons:
                encod_list = json.loads(person.encodings)
                encod_np = np.array(encod_list)

                distance = int(np.linalg.norm(encod_np- list_embd))

                if distance < 10 :
                    my_dict = {}
                    my_dict["id"] = person.id
                    my_dict["name"] = person.p_name
                    data.append(my_dict)

            if len(data) > 0:
                person = Person.objects.get(id = data[0]['id'])
                authen = Authenticated.objects.create(subevent = subevent,person = person )
                authen.save()
                return Response(data[0],status=status.HTTP_200_OK)

            else:
                return Response({"Unauthorized. Access Denied"},status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return Response({"Some Error Occured. Please Try Again"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AuthenticatedView(APIView):

    def get(self,request,*args, **kwargs):
        slug = kwargs['slug']
        try:
            event = Event.objects.get(sevent__slug = slug) # sevent is a related name
            subevent = Subevent.objects.get(slug = slug)
            person = Person.objects.filter(event_name = event)
            authenticated_person = Authenticated.objects.filter(subevent = subevent)
            serializer = AuthenticatedSerializer(authenticated_person,many = True)
            return Response(serializer.data,status= status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"failed"},status=status.HTTP_400_BAD_REQUEST)