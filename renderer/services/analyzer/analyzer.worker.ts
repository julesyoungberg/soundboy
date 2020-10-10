// import * as tf from '@tensorflow/tfjs-node';
import load from 'audio-loader';
import fs from 'fs';
import Meyda from 'meyda/dist/node';
import { expose } from 'threads/worker';

const FEATURES = [
    'chroma',
    'loudness',
    'mfcc',
    'perceptualSharpness',
    'perceptualSpread',
    'spectralCentroid',
    'spectralFlatness',
    'spectralFlux',
    'spectralSlope',
    'spectralRolloff',
    'spectralSpread',
    'spectralSkewness',
    'spectralKurtosis',
];

export function loadSound(filename: string) {
    return load(filename, {
        fetch(url: string) {
            return new Promise((resolve, reject) => {
                console.log('loading', url);
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

// extract basic features from a sound file
export async function getFeatures(filename: string): Promise<Sound> {
    const buffer: AudioBuffer = await loadSound(filename);
    const signal = toMono(buffer);
    console.log('extracting features from', filename);
    const features = Meyda.extract(FEATURES as any, signal);
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

if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    expose(analyzer);
}
