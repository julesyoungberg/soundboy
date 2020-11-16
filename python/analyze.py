import os, shutil
import librosa, librosa.display
import essentia, essentia.standard
import numpy as np
import matplotlib.pyplot as plt
import sklearn



def get_features(d):
    sr = 22050
    duration = 5
    try:
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

        centroid = librosa.feature.spectral_centroid(y=audio, sr = sr, n_fft = nfft, hop_length = hop)
        bandwidth = librosa.feature.spectral_centroid(y= audio, sr = sr, n_fft = nfft, hop_length = hop)
        spectral_flatness = librosa.feature.spectral_flatness(y = audio, n_fft = nfft, hop_length = hop)
        spectral_rolloff = librosa.feature.spectral_rolloff(y = audio, sr = sr, n_fft = nfft, hop_length = hop)
        zcr = librosa.feature.zero_crossing_rate(y = audio, hop_length = 1024)


        feature_vector = [
            centroid.mean(),
            centroid.std(),
            bandwidth.mean(),
            bandwidth.std(),
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
        #normalized_feature_vector = (feature_vector - feature_vector.mean(0)) / feature_vector.std(0)
        return feature_vector, mfccs

    except Exception as e:
        print("error processing file ", dir, e)
        #os.remove(dir)
        print(f"Deleted file{dir}")
        return [-1], [-1]


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

np.save('features', features)
np.save('mfccs', mfccs)
np.save('labels', labels)
