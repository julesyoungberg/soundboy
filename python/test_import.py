import tensorflow as tf
import librosa
import numpy as np
import os

model = tf.keras.models.load_model('saved_models/soundboy_model.h5')

model.summary()

def mfcc(filename):
    audio, srate = librosa.load(filename, sr = 22050, mono = True, duration = 5, res_type='kaiser_fast')
    audio, index = librosa.effects.trim(y = audio, top_db=60, frame_length=2048, hop_length=512)
    nfft = 2048
    hop = 1024

    # 0 pad to 2048 minimum size
    if audio.size < 2048:
        audio = np.pad(audio, (0, 2048 - audio.size), constant_values=(0, 0))
    mfccs = librosa.feature.mfcc(y=audio, sr=srate, n_mfcc=40, n_fft=nfft, hop_length = hop, power = 2.0)

    pad_width = 108 - mfccs.shape[1]
    mfccs = np.pad(mfccs, pad_width=((0,0), (0, pad_width)), mode='reflect')

    return np.array(mfccs)

i = 0
current_label = ""

folder = "./Train"
for root, dirs, files in os.walk(folder, topdown=False):
    for name in files:
        cur_dir = os.path.join(root, name)
        label = root.split('\\')[-1]

        # Testing code
        if (current_label != label):
            current_label = label
            i = 0
        if (i < 10):
            mfccs = mfcc(cur_dir)
            # Reshape the input so it matches input model was trained on, 40 x 108 x 1 array
            mfccs = mfccs.reshape(1, 40, 108, 1)

            class_prediction = model.predict_classes(mfccs)
            probability_matrix = model.predict_proba(mfccs)

            print(class_prediction[0], probability_matrix[0])
            i += 1