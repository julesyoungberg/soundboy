import load from 'audio-loader';
import Meyda from 'meyda';
// import * as tf from '@tensorflow/tfjs-node';
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

export function toMono(buffer: AudioBuffer) {
    if (buffer.numberOfChannels == 1) {
        return buffer.getChannelData(0);
    }

    if (buffer.numberOfChannels == 2) {
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(0);
        return left.map((v, i) => (v + right[i]) / 2);
    }

    throw new Error('unexpected number of channels');
}

export async function getFeatures(filename: string): Promise<Sound> {
    const buffer: AudioBuffer = await load(filename);
    const signal = toMono(buffer);
    const features = Meyda.extract(FEATURES as any, signal);
    return { ...features, filename };
}

/**
 * Main worker function for analyzing a sound file
 * @param filename 
 * @returns sound analysis data
 */
async function analyze(filename: string): Promise<Sound> {
    console.log('Analyze Worker - filename: ', filename);
    const result = await getFeatures(filename);
    // TODO: classify instrument with ML
    return result;
}

const analyzer = { analyze };

export type Analyzer = typeof analyzer;

expose(analyzer);
