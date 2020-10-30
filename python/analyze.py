import os, shutil
import librosa
import numpy as np
import librosa
import librosa.display
import pandas as pd
from tqdm import tqdm


def get_mfcc(dir):
    try:
        audio, srate = librosa.load(dir, res_type='kaiser_fast')
        nffts = [2048, 1024, 512, 256, 128]

        # Ensures that the fft will have adequate frame size
        for i in nffts:
            if i <= audio.size:
                nfft = i
        nffts = 256
        # Max size limits the length of audio sampls so that all features will have the same length (0 padding)
        max_size = min(88200, audio.size)
        mfccs = librosa.feature.mfcc(y=audio[:max_size], sr=srate, n_mfcc=40, n_fft=nfft)
        pad_width = 174 - mfccs.shape[1]
        mfccs = np.pad(mfccs, pad_width=((0,0), (0, pad_width)), mode='constant')
        #mfcc = np.mean(mfccs.T, axis=0)
        return mfccs

    except Exception as e:
        print("error processing file ", dir, e)
        return [-1]


features = []
labels = {'Bass': 0, 'Cymbal': 1, 'Guitar': 2, 'Hat': 3, 'Horn': 4, 'Key': 5, 'Kick': 6, 'Snare': 7, 'String': 8, 'Wind': 9}


folder = "./Train"
for root, dirs, files in os.walk(folder, topdown=False):
    for name in files:
        cur_dir = os.path.join(root, name)
        label = root.split('\\')[1]
        mfcc = get_mfcc(cur_dir)
        
        if len(mfcc) > 1:
            features.append([mfcc, label])


featuresdf = pd.DataFrame(features, columns=['feature', 'class_label'])
featuresdf.to_pickle('featuresdf_conv_256.pkl')

