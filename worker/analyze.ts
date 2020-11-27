import { Sound } from '../@types';

import { MAX_CLIP_LENGTH, SAMPLE_RATE } from './config';
import FeatureExtractor from './FeatureExtractor';
import loadSoundFile from './loadSoundFile';
import trimSamples from './trimSamples';

const extractor = new FeatureExtractor({ useEssentia: true });

/**
 * Appends the desired number of zeros onto the input buffer
 * @param input
 * @param numZeros
 */
// function zeroPad(input: Float32Array, numZeros: number) {
//     const output = new Float32Array(input.length + numZeros).fill(0);
//     for (let i = 0; i < input.length; i++) {
//         output[i] = input[i];
//     }

//     return output;
// }

/**
 * Standardize the length of the input buffer to fit within the frame size and max length
 * @param input
 */
function standardize(input: Float32Array) {
    // const min = FRAME_SIZE;
    const max = MAX_CLIP_LENGTH * SAMPLE_RATE;

    // if (input.length < min) {
    //     return zeroPad(input, min - input.length);
    // }

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

    let buffer = await loadSoundFile(filename, testing ? undefined : SAMPLE_RATE);

    // try {
    //     buffer = await trimSamples(buffer);
    // } catch (e) {
    //     throw new Error(`Error trimming samples: ${e}`);
    // }

    try {
        buffer = standardize(buffer);
    } catch (e) {
        throw new Error(`Error standardizing sample length: ${e}`);
    }

    const result = await extractor.getFeatures(buffer, filename);
    return result;
}
