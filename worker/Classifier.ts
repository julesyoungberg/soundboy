import * as tf from '@tensorflow/tfjs';

import { INSTRUMENTS } from '../constants';

export const N_MFCCS = 40;

/**
 * Classifier class
 * handles all ML-related tasks such as:
 * - loading and managing the model
 * - performing the classification
 */
export default class Classifier {
    n = 108;
    model: tf.LayersModel | undefined;

    ready() {
        return !!this.model;
    }

    async setup() {
        this.model = await tf.loadLayersModel(
            'https://storage.googleapis.com/soundboy-models/instrument_prediction_model/model.json'
        );
    }

    /**
     * Preprocess mfcc input data for
     * @param raw
     */
    preprocess(raw: number[][]) {
        // make sure the mfcc vector is the right length
        const { n } = this;
        let mfccs = raw;
        try {
            if (mfccs[0].length < n) {
                const d = n - mfccs[0].length;
                for (let m = 0; m < N_MFCCS; m++) {
                    for (let i = 0; i < d; i++) {
                        mfccs[m].push(0);
                    }
                }
            } else if (mfccs[0].length > n) {
                for (let m = 0; m < N_MFCCS; m++) {
                    mfccs[m] = mfccs[m].slice(0, n);
                }
            }
        } catch (e) {
            throw new Error(`Error standardizing mfcc vector length: ${e}`);
        }

        try {
            const data = tf.tensor(mfccs);
            const reshaped = data.reshape([1, N_MFCCS, n, 1]);
            return reshaped;
        } catch (e) {
            throw new Error(`Error reshaping mfcc vector: ${e}`);
        }
    }

    /**
     * Main classification routine
     * @param raw
     */
    async classify(raw: number[][]): Promise<string> {
        const data = this.preprocess(raw);

        try {
            let prediction = this.model.predict(data);
            if (Array.isArray(prediction)) {
                [prediction] = prediction;
            }

            prediction = prediction.reshape([INSTRUMENTS.length]);
            const index = prediction.argMax().dataSync()[0];
            if (index < 0 || index >= INSTRUMENTS.length) {
                return undefined;
            }

            return INSTRUMENTS[index];
        } catch (e) {
            throw new Error(`Error predicting instrument: ${e}`);
        }
    }
}
