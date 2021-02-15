import numpy as np
import dlib
import cv2 

detector = dlib.get_frontal_face_detector()

# this extracts the face from the image, which should be passed to the "embedding" function
def get_face(img_name):
  img = cv2.imread(img_name)
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

#  this is to be placed at fastapi
# this gives the embedding of the face image
def embedding(model,face_img):
  face_img = face_img.astype('float32')
  mean,std = face_img.mean(),face_img.std()
  face_img = (face_img-mean)/std
  face_img = np.expand_dims(face_img,axis = 0)
  pred = model.predict(face_img)
  return pred


# calculate the distane between the encodings 
def get_distance(embd1, embd2):
  distance = int(np.linalg.norm(embd1- embd2))
  return distance