import * as tf from '@tensorflow/tfjs';

import FeatureExtractor from './FeatureExtractor';

const MIN_DB = -60;
const FRAME_SIZE = 2048;
const HOP_SIZE = 1024;

const extractor = new FeatureExtractor({
    features: ['rms'],
    frameSize: FRAME_SIZE,
    hopSize: HOP_SIZE,
});

export function trimStart(input: Float32Array) {
    let firstIndex = input.findIndex((value) => value !== 0);
    if (firstIndex > 0) {
        firstIndex--;
    }

    return input.subarray(firstIndex, input.length);
}

export default function trimSamples(input: Float32Array) {
    const { rms } = extractor.getFeatureTracks(input);
    
    const mse = rms.map(v => v * v);
    const t = tf.tensor(mse);
    const maxIndex = t.argMax().dataSync()[0];
    const max = mse[maxIndex];
    const min = 1e-10;

    const nonZero = mse.map(v => {
        let logSpec = 10 * Math.log10(Math.max(min, v));
        logSpec -= 10 * Math.log10(Math.max(min, max));
        return logSpec > MIN_DB;
    });

    let startFrame = nonZero.findIndex((v) => v);
    if (startFrame === nonZero.length) {
        startFrame = 0;
    }
        
    let endFrame = 0;
    for (let i = nonZero.length-1; i >= 0; i--) {
        if (nonZero[i]) {
            endFrame = i === nonZero.length-1 ? i : i + 1;
            break;
        }
    }

    const startIndex = startFrame * HOP_SIZE;
    const endIndex = Math.min((endFrame + 1) * HOP_SIZE, input.length);

    return input.subarray(startIndex, endIndex);
}