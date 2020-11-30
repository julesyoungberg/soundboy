import tensorflow as tf
import librosa
import essentia, essentia.standard
import numpy as np
import os
import json
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt

model = tf.keras.models.load_model('saved_models/soundboy_model_zeros.h5')

model.summary()


labels = np.load('labels.npy')
labels = np.unique(labels)

#print(labels)
these_labels = []
pred_labels = []

mfccs = np.load('zero_mfccs_val.npy')
these_labels = np.load('zero_labels_val.npy')
real_labels = []

mfccs = np.array([mfcc[1:] for mfcc in mfccs])

from tqdm import tqdm 

for key, mfcc in enumerate(tqdm(mfccs)):
    mfcc = mfcc.reshape(1, 12, 95, 1)
    class_prediction = model.predict_classes(mfcc)
    pred_labels.append(labels[class_prediction])
    real_labels.append(these_labels[key])


fig = plt.figure()
ax = fig.add_subplot()


cm = confusion_matrix(y_true = these_labels, y_pred = pred_labels)
cax = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
fig.colorbar(cax)
ax.set_xticks(np.arange(10))
ax.set_yticks(np.arange(10))
ax.set_xticklabels(labels.tolist(), rotation=45)
ax.set_yticklabels(labels.tolist())
ax.set_ylabel('True label')
ax.set_xlabel('Predicted label')

plt.show()


