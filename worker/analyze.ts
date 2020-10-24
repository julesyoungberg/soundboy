import load from 'audio-loader';

import { Sound } from '../@types';

import FeatureExtractor from './feature-extractor';

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

/**
 * extract basic features from a sound file
 * @param filename
 */
export async function getFeatures(filename: string): Promise<Sound> {
    console.log('extracting features from', filename);
    const buffer = toMono(await load(filename));
    const features = extractor.getFeatures(buffer);
    return { filename, ...features };
}

/**
 * Main worker function for analyzing a sound file
 * @param filename
 * @returns sound analysis data
 */
export default async function analyze(filename: string): Promise<Sound> {
    console.log('Analyze Worker - filename: ', filename);
    const result = await getFeatures(filename);
    return result;
}
