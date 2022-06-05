## Facial Authentication System

*This application has not been deployed yet. I do not have access to any hosting services like AWS or Azure that provide GPU support for free.*
*For testing, I created a microservice using Flask and Ngrok in Google Colab, where the Facenet Model was run and served using a REST API.*
*This application can only be deployed once I get access to a free GPU service.*



This program authenticates people using their faces and stores the data in a database. This application is being developed using Django and React. React is set up manually using Webpack and rendered using Django templates.

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

## Running the facenet API
- Deploy the Flask app from `facenet_api.py` on a cloud service provider like AWS or Azure that provides GPU support.
- Copy the URL of the app and paste it in the `TrainView` and `VerifyView` of `views.py` inside the `mainapp` directory.


## How To Use??
1. Register.

2. Create an event. An event holds the record of people belonging to a particular group or category. For example, in a school, an event can represent a particular grade, i.e., all the students from grade 1 will belong to one event, grade 2 to another event, and so on.

3. Train the model for each face belonging to a particular event. This can be done with a camera or by uploading a picture.

4. Create a subevent. Subevents are subsets of an event. A subevent will inherit all the records of its parent event. If January is an event, then each day of January can be a subevent. This way, the same record can be used for each day without the need to retrain the model.

5. Perform verification for each subevent.