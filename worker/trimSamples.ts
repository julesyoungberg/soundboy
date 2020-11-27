import * as tf from '@tensorflow/tfjs';

import FeatureExtractor from './FeatureExtractor';

const MIN_DB = -60;
const FRAME_SIZE = 2048;
const HOP_SIZE = 1024;

const rmsExtractor = new FeatureExtractor({
    features: ['rms'],
    frameSize: FRAME_SIZE,
    hopSize: HOP_SIZE,
    useEssentia: false,
});

/**
 * find the first non zero sample and filter up till the sample before it
 * @param input
 */
export function trimStart(input: Float32Array) {
    let firstIndex = input.findIndex((value) => value !== 0);
    if (firstIndex > 0) {
        firstIndex--;
    }

    return input.subarray(firstIndex, input.length);
}

/**
 * trim silence from the start and end of the input buffer
 * @param input
 */
export default async function trimSamples(input: Float32Array) {
    let data: { rms: number[] };
    try {
        data = await rmsExtractor.getFeatureTracks(input);
    } catch (e) {
        throw new Error(`Error getting sample RMS: ${e}`);
    }

    const { rms } = data;

    const mse = rms.map((v) => v * v);
    const t = tf.tensor(mse);
    const maxIndex = t.argMax().dataSync()[0];
    const max = mse[maxIndex];
    const min = 1e-10;

    // find the non silent frames
    const nonZero = mse.map((v) => {
        let logSpec = 10 * Math.log10(Math.max(min, v));
        logSpec -= 10 * Math.log10(Math.max(min, max));
        return logSpec > MIN_DB;
    });

    // find the first non zero frame
    let startFrame = nonZero.findIndex((v) => v);
    if (startFrame === nonZero.length) {
        startFrame = 0;
    }

    // find the last non zero frame
    let endFrame = nonZero.length - 1;
    for (; endFrame > startFrame; endFrame--) {
        if (nonZero[endFrame]) {
            if (endFrame < nonZero.length - 1) {
                endFrame++;
            }
            break;
        }
    }

    // convert frame indices to buffer indices
    const startIndex = startFrame * HOP_SIZE;
    const endIndex = Math.min((endFrame + 1) * HOP_SIZE, input.length);

    return input.subarray(startIndex, endIndex);
}
