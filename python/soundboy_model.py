from sklearn.preprocessing import LabelEncoder
from keras.utils import to_categorical
from keras.layers import Dense, Activation, Dropout, Conv2D, MaxPooling2D, GlobalAveragePooling2D
from keras.models import Sequential

import numpy as np

import tensorflow as tf
tf.compat.v1.disable_eager_execution()
tf.compat.v1.experimental.output_all_intermediates(True)

# # Check if using GPU 
# tf.config.experimental.list_physical_devices('GPU')
# exit()

features = np.load('features.npy')
mfccs = np.load('essentia_mfccs_new.npy')
labels = np.load('essentia_labels_new.npy')

mfccs = np.array([mfcc[1:] for mfcc in mfccs])

le = LabelEncoder()

yy = to_categorical(le.fit_transform(labels))

from sklearn.model_selection import train_test_split

x_train, x_test, y_train, y_test = train_test_split(mfccs, yy, test_size=0.2, random_state=42)


num_rows = 12
num_columns = 95
num_channels = 1

x_train = x_train.reshape(x_train.shape[0], num_rows, num_columns, 1)
x_test = x_test.reshape(x_test.shape[0], num_rows, num_columns, 1)

num_labels = yy.shape[1]
filter_size = 2

# Construct model 
model = Sequential()
model.add(Conv2D(filters=16, kernel_size=2, 
                input_shape=(num_rows, num_columns, num_channels),activation='relu'))
#model.add(MaxPooling2D(pool_size=2))
model.add(Dropout(0.2))

model.add(Conv2D(filters=32, kernel_size=2, activation='relu'))
model.add(MaxPooling2D(pool_size=2))
model.add(Dropout(0.2))

model.add(Conv2D(filters=32, kernel_size=3, activation='relu'))
#model.add(MaxPooling2D(pool_size=2))
model.add(Dropout(0.2))

model.add(Conv2D(filters=64, kernel_size=2, activation='relu'))
model.add(MaxPooling2D(pool_size=2))
model.add(Dropout(0.2))
model.add(GlobalAveragePooling2D())

model.add(Dense(num_labels, activation='softmax'))


# Compile the model
model.compile(loss='categorical_crossentropy', metrics=['accuracy'], optimizer='adam')

# Display model architecture summary 
model.summary()



# Calculate pre-training accuracy 
score = model.evaluate(x_test, y_test)
accuracy = 100*score[1]

print("Pre-training accuracy: %.4f%%" % accuracy) 

from keras.callbacks import ModelCheckpoint, EarlyStopping
from datetime import datetime

num_epochs = 50
num_batch_size = 64

checkpointer = ModelCheckpoint(filepath='saved_models/checkpoint', verbose=1, save_best_only=True)

start=datetime.now()

model.fit(x_train, y_train, batch_size = num_batch_size, epochs = num_epochs, validation_data=(x_test, y_test))
es = EarlyStopping(monitor='val_loss')


duration = datetime.now() - start
print("training completed in ", duration)


score = model.evaluate(x_train, y_train, verbose=0)
print("Training Accuracy: ", score[1])

score = model.evaluate(x_test, y_test, verbose=0)
print("Testing Accuracy: ", score[1])

model.save('saved_models/soundboy_model_new.h5')

np.save('x_test_new', x_test)
np.save('y_test_new', np.array(le.inverse_transform([np.argmax(y) for y in y_test])))