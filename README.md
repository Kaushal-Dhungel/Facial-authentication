## Facial Authentication System

*This application is still in development mode and not deployed yet. I do not have access to any hosting services like AWS or Azure that provides GPU support.*
*For testing I create a microservice using Flask and Ngrok in Google Colab where the Facenet Model is run and served using Rest API*
*I am trying to access Azure using Github Student Pack but due to some problems, I haven't been able to do so.Hopefully, it will be solved in the near future.*



This program authenticates people using their faces and stores the data in the database. 
This application is being written using Django + React. React is set up manually using webpack and rendered using the django templates.

## Set Up Instructions
1. Clone the repo.
```sh
$ git clone https://github.com/Kaushal-Dhungel/Facial-authentication.git
```

2. Install the dependencies
```sh
$ pip install -r requirements.txt
```

3. Go to front directory.
```sh
$ cd front
```

4. Install npm dependencies
```sh
$ npm i
```

6. Run the program.
```sh
$ python3 manage.py runserver
```

## How To Use??
1. Register
2. Create An Event. An event holds the record of people belonging to a particular group or category. Suppose, in a school, an event can represent a particular grade,  i.e all the students from grade 1 will belong to one event, grade 2 to another event and so on. 
3. Train the model for each face belonging to a particular event. It can be done with camera or by uploading the picture.
4. Create A Subevent. Subevents are the subsets of an event. A subevent will inherit all the records of its parent event. If January is an event then each day of January can be a subevent. This way same record can be used for each day without the need to retrain the model.
5. Now verification can be performed for each subevent.