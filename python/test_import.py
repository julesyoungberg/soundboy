import tensorflow as tf
import librosa
import essentia, essentia.standard
import numpy as np
import os
import json
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import confusion_matrix
import matplotlib.pyplot as plt

model = tf.keras.models.load_model('saved_models/soundboy_model_new.h5')

model.summary()


labels = np.load('labels.npy')
labels = np.unique(labels)

print(labels)
these_labels = []
pred_labels = []

mfccs = np.load('x_test_new.npy')
these_labels = np.load('y_test_new.npy')
real_labels = []
print(mfccs[0].shape)

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
plt.tight_layout()
ax.set_xticks(np.arange(10))
ax.set_yticks(np.arange(10))
ax.set_xticklabels(labels.tolist(), rotation=45)
ax.set_yticklabels(labels.tolist())
plt.ylabel('True label')
plt.xlabel('Predicted label')

plt.show()


