from re import A
from keras.engine.saving import save_attributes_to_hdf5_group
from sklearn.preprocessing import LabelEncoder
from keras.utils import to_categorical
import pandas as pd
import numpy as np

import tensorflow as tf
tf.compat.v1.disable_eager_execution()
tf.compat.v1.experimental.output_all_intermediates(True)

df = pd.read_pickle('featuresdf.pkl')

X = np.array(df.feature.tolist())
y = np.array(df.class_label.tolist())

le = LabelEncoder()

yy = to_categorical(le.fit_transform(y))

from sklearn.model_selection import train_test_split

x_train, x_test, y_train, y_test = train_test_split(X, yy, test_size=0.2, random_state=42)

num_labels = yy.shape[1]
filter_size = 2


import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Convolution2D, Conv2D, MaxPooling2D, GlobalAveragePooling2D
from keras.optimizers import Adam
from keras.utils import np_utils, plot_model
from sklearn import metrics 

# num_rows = 40
# num_columns = 174
# num_channels = 1

# x_train = x_train.reshape(x_train.shape[0], num_rows, num_columns, num_channels)
# x_test = x_test.reshape(x_test.shape[0], num_rows, num_columns, num_channels)

num_labels = yy.shape[1]
filter_size = 2

# Construct model 
model = Sequential()
model.add(Dense(256, input_shape=(40, )))
model.add(Activation('relu'))
model.add(Dropout(0.5))

model.add(Dense(256))
model.add(Activation('relu'))
model.add(Dropout(0.5))

model.add(Dense(num_labels))
model.add(Activation('softmax'))



# Compile the model
model.compile(loss='categorical_crossentropy', metrics=['accuracy'], optimizer='adam')

# Display model architecture summary 
model.summary()


# Calculate pre-training accuracy 
score = model.evaluate(x_test, y_test)
accuracy = 100*score[1]

print("Pre-training accuracy: %.4f%%" % accuracy) 

from keras.callbacks import ModelCheckpoint
from datetime import datetime

num_epochs = 50
num_batch_size = 128

checkpointer = ModelCheckpoint(filepath='saved_models/weights.best.basic_mlp.hdf5', verbose=1, save_best_only=True)

start=datetime.now()

model.fit(x_train, y_train, batch_size = num_batch_size, epochs = num_epochs, validation_data=(x_test, y_test))

duration = datetime.now() - start
print("training completed in ", duration)


score = model.evaluate(x_train, y_train, verbose=0)
print("Training Accuracy: ", score[1])

score = model.evaluate(x_test, y_test, verbose=0)
print("Testing Accuracy: ", score[1])