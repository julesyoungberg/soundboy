import { Sound } from '../@types';

import FeatureExtractor from './FeatureExtractor';
import loadSoundFile from './loadSoundFile';
import trimSamples from './trimSamples';

export const SAMPLE_RATE = 22050;
export const FRAME_SIZE = 2048;
export const HOP_SIZE = 1024;
export const MAX_CLIP_LENGTH = 5; // seconds

const extractor = new FeatureExtractor({
    frameSize: FRAME_SIZE,
    hopSize: HOP_SIZE,
    sampleRate: SAMPLE_RATE,
});

/**
 * Appends the desired number of zeros onto the input buffer
 * @param input
 * @param numZeros
 */
function zeroPad(input: Float32Array, numZeros: number) {
    const output = new Float32Array(input.length + numZeros).fill(0);
    for (let i = 0; i < input.length; i++) {
        output[i] = input[i];
    }

    return output;
}

/**
 * Standardize the length of the input buffer to fit within the frame size and max length
 * @param input
 */
function standardize(input: Float32Array) {
    const min = FRAME_SIZE;
    const max = MAX_CLIP_LENGTH * SAMPLE_RATE;

    if (input.length < min) {
        return zeroPad(input, min - input.length);
    }

    if (input.length > max) {
        return input.subarray(0, max);
    }

    return input;
}

/**
 * Main worker function for analyzing a sound file
 * @param filename
 * @returns sound analysis data
 */
export default async function analyze(filename: string, testing?: boolean): Promise<Sound> {
    console.log('Analyze Worker - filename: ', filename);
    
    if (!extractor.ready()) {
        await extractor.setup();
    }

    let buffer = await loadSoundFile(filename, testing ? undefined : SAMPLE_RATE);
    buffer = standardize(trimSamples(buffer));

    const result = await extractor.getFeatures(buffer, filename);
    return result;
}
