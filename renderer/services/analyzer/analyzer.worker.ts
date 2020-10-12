// import * as tf from '@tensorflow/tfjs-node';
import load from 'audio-loader/lib/index';
import fs from 'fs';
import meyda from 'meyda/dist/node/main';
import { expose } from 'threads/worker';

import decode from './decode';

const FEATURES = [
    'chroma',
    'loudness',
    'mfcc',
    'perceptualSharpness',
    'perceptualSpread',
    'spectralCentroid',
    'spectralFlatness',
    // 'spectralFlux',
    'spectralSlope',
    'spectralRolloff',
    'spectralSpread',
    'spectralSkewness',
    'spectralKurtosis',
];

// audio-loader probably isn't needed, we specify all custom functions anyways
export function loadSound(filename: string) {
    return load(filename, {
        decode,
        fetch(url: string) {
            return new Promise((resolve, reject) => {
                fs.readFile(url, (err, data) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(data.buffer);
                    }
                });
            });
        },
    });
}

function diffFromPowerOfTwo(num: number): number {
    let n = 2;
    while (n < num) {
        n *= 2;
    }
    return n - num;
}

// convert a stereo signal to mono by averaging the two channels
export function toMono(buffer: AudioBuffer) {
    if (buffer.numberOfChannels === 1) {
        return buffer.getChannelData(0);
    }

    if (buffer.numberOfChannels === 2) {
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(0);
        return left.map((v, i) => (v + right[i]) / 2);
    }

    throw new Error('unexpected number of channels');
}

// make sure an audio buffer has a length of power of two
export function powerOf2(buffer: AudioBuffer): AudioBuffer | Float32Array {
    const diff = diffFromPowerOfTwo(buffer.length);
    if (diff === 0) {
        return buffer;
    }

    // Convert to mono and pad
    // TODO avoid converting to mono
    const buf = new Float32Array(buffer.length + diff).fill(0);
    toMono(buffer).forEach((v, i) => {
        buf[i] = v;
    });
    return buf;
}

// extract basic features from a sound file
// TODO step through the sample rather than just using the first n samples
export async function getFeatures(filename: string): Promise<Sound> {
    const buffer = toMono(await loadSound(filename));
    console.log('extracting features from', filename);
    meyda.bufferSize = 2048;
    const features = meyda.extract(FEATURES, buffer.slice(0, 2048), []);
    return { ...features, filename };
}

/**
 * Main worker function for analyzing a sound file
 * @param filename
 * @returns sound analysis data
 */
export async function analyze(filename: string): Promise<Sound> {
    console.log('Analyze Worker - filename: ', filename);
    const result = await getFeatures(filename);
    // TODO: classify instrument with ML
    return result;
}

const analyzer = { analyze };

export type Analyzer = typeof analyzer;

// eslint-disable-next-line
if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    expose(analyzer);
}
