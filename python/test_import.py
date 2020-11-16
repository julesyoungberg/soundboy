import tensorflow as tf
import librosa
import essentia, essentia.standard
import numpy as np
import os
import json

model = tf.keras.models.load_model('saved_models/soundboy_model.h5')

model.summary()

def mfcc(d):
    sr = 22050
    duration = 5
    audio, srate = librosa.load(d, sr = sr, mono = True, duration = duration, res_type='kaiser_best')
    audio, index = librosa.effects.trim(y = audio, top_db=60, frame_length=2048, hop_length=512)

    nfft = 2048
    hop = 1024

    # 0 pad to 2048 minimum size
    if audio.size < 2048:
        audio = np.pad(audio, (0, 2048 - audio.size), constant_values=(0, 0))

    w = essentia.standard.Windowing(type = 'hann')
    spectrum = essentia.standard.Spectrum()
    mfcc = essentia.standard.MFCC(numberCoefficients=40, sampleRate=22050, numberBands = 128)

    mfccs = []


    for frame in essentia.standard.FrameGenerator(audio, frameSize = nfft, hopSize = hop):
        mfcc_bands, mfcc_coeffs = mfcc(spectrum(w(frame)))
        mfccs.append(mfcc_coeffs)
                
    mfccs = essentia.array(mfccs).T

    pad_width = 109 - mfccs.shape[1]
    mfccs = np.pad(mfccs, pad_width=((0,0), (0, pad_width)), mode='reflect')

    return mfccs





i = 0
current_label = ""
labels = ["Bass", 'Cymbal', 'Guitar', 'Hat', 'Horn', 'Key', 'Kick', 'Snare', 'String', 'Wind']

folder = "./testing_samples"
for root, dirs, files in os.walk(folder, topdown=False):
    for name in files:
        cur_dir = os.path.join(root, name)
        label = root.split('/')[-1]

        # Testing code
        if (current_label != label):
            current_label = label
            i = 0
        if (i < 10):
            mfccs = mfcc(cur_dir)
            # Reshape the input so it matches input model was trained on, 40 x 108 x 1 array
            
        # with open(cur_dir) as f:
        #     mfccs = json.load(f)
        #     mfccs = np.array(mfccs)
            

            #pad_width = 109 - mfccs.shape[1]
            #mfccs = np.pad(mfccs, pad_width=((0,0), (0, pad_width)), mode='reflect')
            mfccs = mfccs.reshape(1, 40, 109, 1)

            class_prediction = model.predict_classes(mfccs)
            probability_matrix = model.predict_proba(mfccs)

            print(label, labels[class_prediction[0]])
            #print(probability_matrix)
            i += 1