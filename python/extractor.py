import os, shutil
import librosa
import numpy as np
import librosa
import librosa.display


def get_mfcc(sample):
    return sample

folder = "./Train"
for root, dirs, files in os.walk(folder, topdown=False):
    for name in files:
        cur_dir = os.path.join(root, name)
        tar_dir = os.path.join(root, name.split('.')[0]).strip()

        if not os.path.exists(tar_dir):
            os.mkdir(tar_dir)
        shutil.move(cur_dir, tar_dir)
        #shutil.copy(cur_dir, tar_dir)
        #os.remove(cur_dir)

