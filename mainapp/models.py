from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import User

# Create your models here.
class Event(models.Model):
    user = models.ForeignKey(User,on_delete= models.CASCADE)
    name = models.CharField(max_length=400,null= False, blank = False)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField()

    def save(self,*args, **kwargs):
        original_slug = slugify(f"{self.name}")
        queryset = Event.objects.all().filter(slug__iexact = original_slug).count()  # count the no of items with same slug

        count = 1
        slug = original_slug 

        while(queryset):  # if there is any queryset, i.e while(1), if not queryset then it becomes while(0) so this part will be skipped
            slug = original_slug + "-" + str(count)
            count += 1 
            queryset = Event.objects.all().filter(slug__iexact = slug).count()  # count the no of items with same slug
 
        self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return str(f"{self.name}---{self.id}")

class Subevent(models.Model):
    event = models.ForeignKey(Event,on_delete=models.CASCADE,related_name='sevent')
    s_name = models.CharField(max_length=400,null= False, blank = False)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField()

    def save(self,*args, **kwargs):
        original_slug = slugify(f"{self.s_name}")
        queryset = Subevent.objects.all().filter(slug__iexact = original_slug).count()  # count the no of items with same slug

        count = 1
        slug = original_slug 

        while(queryset):  # if there is any queryset, i.e while(1), if not queryset then it becomes while(0) so this part will be skipped
            slug = original_slug + "-" + str(count)
            count += 1 
            queryset = Subevent.objects.all().filter(slug__iexact = slug).count()  # count the no of items with same slug
 
        self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return str(f"{self.s_name}---{self.id}")

class Person(models.Model):

    def generate_filename(self, filename):
        url = "person/%s/%s" % (self.event_name.name, filename)
        return url

    event_name = models.ForeignKey(Event,on_delete=models.CASCADE,related_name='pevent')
    p_name = models.CharField(max_length=400,null= False, blank = False)
    image = models.ImageField(upload_to=generate_filename)
    encodings = models.CharField(max_length=3000,null= False, blank = False) # change max_len to 3000
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(f"{self.p_name}---{self.id}")

class Authenticated(models.Model):
    subevent = models.ForeignKey(Subevent,on_delete = models.CASCADE,related_name='subevent')
    person = models.ForeignKey(Person,on_delete = models.CASCADE,related_name="person")
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    @property
    def get_name(self):
        name = self.person.p_name
        return name

    @property
    def get_img(self):
        image = self.person.image.url
        return image

    def __str__(self):
        return str(f"{self.subevent.s_name}---{self.person}---{self.id}")