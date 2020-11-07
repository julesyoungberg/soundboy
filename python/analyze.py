import os, shutil
import librosa
import numpy as np
import librosa
import librosa.display
import pandas as pd
from tqdm import tqdm
import matplotlib.pyplot as plt
import sklearn



def get_features(dir):
    sr = 22050
    duration = 5
    try:
        audio, srate = librosa.load(dir, sr = sr, mono = True, duration = duration, res_type='kaiser_fast')
        audio, index = librosa.effects.trim(y = audio, top_db=60, frame_length=2048, hop_length=512)
        nfft = 2048
        hop = 1024

        # 0 pad to 2048 minimum size
        if audio.size < 2048:
            audio = np.pad(audio, (0, 2048 - audio.size), constant_values=(0, 0))


        # Max size limits the length of audio sampls so that all features will have the same length (0 padding)
        max_size = min(srate * 3, audio.size)
        mfccs = librosa.feature.mfcc(y=audio, sr=srate, n_mfcc=40, n_fft=nfft, hop_length = hop, power = 2.0)

        pad_width = 108 - mfccs.shape[1]
        mfccs = np.pad(mfccs, pad_width=((0,0), (0, pad_width)), mode='reflect')
        

        centroid = librosa.feature.spectral_centroid(y=audio, sr = srate, n_fft = nfft, hop_length = hop)
        bandwidth = librosa.feature.spectral_centroid(y= audio, sr = srate, n_fft = nfft, hop_length = hop)
        spectral_contrast = librosa.feature.spectral_contrast(y = audio, sr = srate, n_fft = nfft, hop_length = hop)
        spectral_flatness = librosa.feature.spectral_flatness(y = audio, n_fft = nfft, hop_length = hop)
        spectral_rolloff = librosa.feature.spectral_rolloff(y = audio, sr = srate, n_fft = nfft, hop_length = hop)
        zcr = librosa.feature.zero_crossing_rate(y = audio, hop_length = 1024)


        feature_vector = [
            centroid.mean(),
            centroid.std(),
            bandwidth.mean(),
            bandwidth.std(),
            # spectral_contrast[0].mean(),
            # spectral_contrast[0].std(),
            # spectral_contrast[1].mean(),
            # spectral_contrast[1].std(),
            # spectral_contrast[2].mean(),
            # spectral_contrast[2].std(),
            # spectral_contrast[3].mean(),
            # spectral_contrast[3].std(),
            # spectral_contrast[4].mean(),
            # spectral_contrast[4].std(),
            # spectral_contrast[5].mean(),
            # spectral_contrast[5].std(),
            spectral_flatness.mean(),
            spectral_flatness.std(),
            spectral_rolloff.mean(),
            spectral_rolloff.std(),
            zcr.mean(),
            zcr.std(),
            mfccs.mean(),
            mfccs.std()
        ]
        
        feature_vector = np.array(feature_vector)
        normalized_feature_vector = (feature_vector - feature_vector.mean(0)) / feature_vector.std(0)
        return normalized_feature_vector, mfccs

    except Exception as e:
        print("error processing file ", dir, e)
        os.remove(dir)
        print(f"Deleted file{dir}")
        return [-1]


features = []
mfccs = []
labels = []

i = 10
current_label = ""

folder = "./Train"
for root, dirs, files in os.walk(folder, topdown=False):
    for name in files:
        cur_dir = os.path.join(root, name)
        label = root.split('\\')[-1]

        # # Testing code
        # if (current_label != label):
        #     current_label = label
        #     i = 0
        # if (i < 10):
        #     feature_vector, mfcc = get_features(cur_dir)
        #     i += 1
        #     if len(feature_vector) > 1:
        #         features.append(feature_vector)
        #         print(i)
        #         # Standardizing mfcc data so coefficient dimension has zero mean and unit variance
        #         mfcc = sklearn.preprocessing.scale(mfcc.astype(float), axis=0)
        #         mfccs.append(mfcc)
        #         labels.append(label)
            

        # Real Code
        feature_vector, mfcc = get_features(cur_dir)
        if len(feature_vector) > 1:
            features.append(feature_vector)
            # Standardizing mfcc data so coefficient dimension has zero mean and unit variance
            mfcc = sklearn.preprocessing.scale(mfcc.astype(float), axis=0)
            mfccs.append(mfcc)
            labels.append(label)

features = np.array(features)
labels = np.array(labels)
mfccs = np.array(mfccs)

#np.save('features', features)
np.save('mfccs_normalized', mfccs)
#np.save('labels', labels)