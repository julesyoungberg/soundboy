import os, shutil
import librosa
import essentia.standard
import numpy as np
import librosa
import librosa.display
import essentia
from tqdm import tqdm
import matplotlib.pyplot as plt
import sklearn



def get_features(d):
    try:

        sr = 22050
        duration = 3
        nfft = 2048

        #loader = essentia.standard.EasyLoader(filename=d, sampleRate = sr, endTime = 5)
        #loader = essentia.standard.EqloudLoader(filename=d, sampleRate = sr, endTime = duration)
        loader = essentia.standard.MonoLoader(filename=d, sampleRate = sr)
        audio = loader()

        if (len(audio) > duration * sr):
            audio = audio[:duration * sr]
        

        n_coef = 13
        n_bands = 40
        frame_size = 2048
        hop = 1024
        
        w = essentia.standard.Windowing(type = 'hann')
        spectrum = essentia.standard.Spectrum()
        mfcc = essentia.standard.MFCC(numberCoefficients=n_coef, sampleRate=sr, numberBands = n_bands)

        mfccs = []

        for frame in essentia.standard.FrameGenerator(audio, frameSize = frame_size, hopSize = hop):
                mfcc_bands, mfcc_coeffs = mfcc(spectrum(w(frame)))
                mfccs.append(mfcc_coeffs)
        

        mfccs = essentia.array(mfccs).T
        pad_width = 95 - mfccs.shape[1]
        mfccs = np.pad(mfccs, pad_width=((0,0), (0, pad_width)), mode='reflect')

        # centroid = librosa.feature.spectral_centroid(y=audio, sr = sr, n_fft = nfft, hop_length = hop)
        # bandwidth = librosa.feature.spectral_centroid(y= audio, sr = sr, n_fft = nfft, hop_length = hop)
        # spectral_contrast = librosa.feature.spectral_contrast(y = audio, sr = sr, n_fft = nfft, hop_length = hop)
        # spectral_flatness = librosa.feature.spectral_flatness(y = audio, n_fft = nfft, hop_length = hop)
        # spectral_rolloff = librosa.feature.spectral_rolloff(y = audio, sr = sr, n_fft = nfft, hop_length = hop)
        # zcr = librosa.feature.zero_crossing_rate(y = audio, hop_length = 1024)


        # feature_vector = [
        #     centroid.mean(),
        #     centroid.std(),
        #     bandwidth.mean(),
        #     bandwidth.std(),
        #     # spectral_contrast[0].mean(),
        #     # spectral_contrast[0].std(),
        #     # spectral_contrast[1].mean(),
        #     # spectral_contrast[1].std(),
        #     # spectral_contrast[2].mean(),
        #     # spectral_contrast[2].std(),
        #     # spectral_contrast[3].mean(),
        #     # spectral_contrast[3].std(),
        #     # spectral_contrast[4].mean(),
        #     # spectral_contrast[4].std(),
        #     # spectral_contrast[5].mean(),
        #     # spectral_contrast[5].std(),
        #     spectral_flatness.mean(),
        #     spectral_flatness.std(),
        #     spectral_rolloff.mean(),
        #     spectral_rolloff.std(),
        #     zcr.mean(),
        #     zcr.std(),
        #     mfccs.mean(),
        #     mfccs.std()
        # ]
        
        # feature_vector = np.array(feature_vector)
        #normalized_feature_vector = (feature_vector - feature_vector.mean(0)) / feature_vector.std(0)
        return mfccs

    except Exception as e:
        print("error processing file ", dir, e)
        #os.remove(dir)
        print(f"Deleted file{dir}")
        return [-1]


features = []
mfccs = []
labels = []

i = 10
current_label = ""

folder = "./Train"
for root, dirs, files in os.walk(folder, topdown=False):
    for name in tqdm(files):
        cur_dir = os.path.join(root, name)
        label = cur_dir.split('/')[-2]

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
        mfcc = get_features(cur_dir)
        if len(mfcc) > 1:
            #features.append(feature_vector)
            # Standardizing mfcc data so coefficient dimension has zero mean and unit variance
            mfccs.append(mfcc)
            labels.append(label)

features = np.array(features)
labels = np.array(labels)
mfccs = np.array(mfccs)

#np.save('features', features)
np.save('essentia_mfccs_new', mfccs)
np.save('essentia_labels_new', labels)
