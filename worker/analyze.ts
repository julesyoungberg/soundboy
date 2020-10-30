import load from 'audio-loader';

import { Sound } from '../@types';

import FeatureExtractor from './FeatureExtractor';

const extractor = new FeatureExtractor();

/**
 * convert a stereo signal to mono by averaging the two channels
 * @param buffer
 */
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

async function loadSoundFile(filename: string): Promise<Float32Array> {
    let buffer: AudioBuffer | undefined;
    try {
        buffer = await load(filename);
    } catch (e) {
        throw new Error(`Error loading '${filename}': ${e}`);
    }

    let samples: Float32Array | undefined;
    try {
        samples = toMono(buffer);
    } catch (e) {
        throw new Error(`Error converting '${filename}' to mono: ${e}`);
    }

    return samples;
}

/**
 * Main worker function for analyzing a sound file
 * @param filename
 * @returns sound analysis data
 */
export default async function analyze(filename: string): Promise<Sound> {
    console.log('Analyze Worker - filename: ', filename);

    const buffer = await loadSoundFile(filename);

    return extractor.getFeatures(buffer, filename);
}
