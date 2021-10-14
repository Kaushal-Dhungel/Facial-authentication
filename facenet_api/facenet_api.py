
# imports for processing images and face detection
from tensorflow import keras
# from tensorflow.keras.models import load_model
import tensorflow as tf
import numpy as np 
import cv2
import dlib
import matplotlib.pyplot as plt

# imports for serving the model as Rest API
from PIL import Image
from flask_ngrok import run_with_ngrok
from flask import Flask, request, jsonify 


# load the facenet model
model = tf.keras.models.load_model('facenet_keras.h5')

# for deceting the face in an image
detector = dlib.get_frontal_face_detector()

# extracts face from the image
def get_face(img):
    img_2 = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    faces = detector(img_2)
    
    if len(faces) == 0:
      return "no face"

    for face in faces:
      x1 = face.left()
      x2 = face.right()
      y1 = face.top()
      y2 = face.bottom()
    
    new_face = img[y1:y2,x1:x2]
    new_face = cv2.resize(new_face,(160,160))
    return new_face

# plot the extracted face using matplotlib
def show_face(img):
  img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
  plt.imshow(img)
  plt.show()

# get the 128 dim embeddings from the face
def embedding(img):
  x = img.astype('float32')
  mean,std = x.mean(),x.std()
  x = (x-mean)/std
  x = np.expand_dims(x,axis = 0)
  pred = model.predict(x)
  return pred



app = Flask(__name__)
run_with_ngrok(app)

"""
Copy the url exposed by ngrok and paste in the TrainView and VerifyView of views.py
"""
@app.route("/",methods = ['POST'])
def index():
    file = request.files['image']
    myimg = Image.open(file.stream)
    myimg = np.array(myimg)
    myface = get_face(myimg)

    if myface == 'no face':
      return jsonify({'msg':'no face detected','embd':[]})

    # show_face(myface)
    embd = embedding(model,myface)
    print(embd)
    listembd = embd.tolist()
    print(listembd)
    return jsonify({'msg': 'success', 'embd': listembd})

app.run()