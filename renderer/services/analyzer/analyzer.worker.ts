import load from 'audio-loader/lib/index';
import fs from 'fs';
import meyda from 'meyda/dist/node/main';
import { expose } from 'threads/worker';

import { Sound } from '../../../@types';

import Analyzer from './analyzer';
import decode from './decode';

const HOP_SIZE = 512
const FRAME_SIZE = 2048

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

const analyzer = new Analyzer(FEATURES);

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

// convert a stereo signal to mono by averaging the two channels
export function toMono(buffer: AudioBuffer) {
    if (buffer.numberOfChannels === 1) {
        return buffer.getChannelData(0);
    }

    if (buffer.numberOfChannels === 2) {
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        return left.map((v, i) => (v + right[i]) / 2);
    }

    throw new Error('unexpected number of channels');
}

// extract basic features from a sound file
export async function getFeatures(filename: string): Promise<Sound> {
    console.log('extracting features from', filename);
    const buffer = toMono(await loadSound(filename));
    const features = analyzer.analyze(buffer);
    return { filename, ...features };
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

const analyzerWorker = { analyze };

export type AnalyzerWorker = typeof analyzer;

// eslint-disable-next-line
if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    expose(analyzerWorker);
}
