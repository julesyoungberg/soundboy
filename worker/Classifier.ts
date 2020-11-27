import * as tf from '@tensorflow/tfjs';
import fs from 'fs';

import { INSTRUMENTS } from '../constants';

import { N_MFCC_COEFS } from './config';

/**
 * Classifier class
 * handles all ML-related tasks such as:
 * - loading and managing the model
 * - performing the classification
 */
export default class Classifier {
    n = 95;
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
    preprocess(raw: number[][], filename?: string) {
        // make sure the mfcc vector is the right length
        const { n } = this;
        let mfccs = raw.map((coefs) => coefs.slice(1));
    
        // Save the raw mfccs to a file for comparisons in python
        // const pathParts = filename.split('/');
        // const f = pathParts[pathParts.length - 1].split(' ').join('_');
        // fs.writeFileSync(`/Users/jules/workspace/soundboy/python/notebooks/mfccs/${f}-mfccs.json`, JSON.stringify(mfccs, null, 2));
    
        try {
            if (mfccs.length < n) {
                const d = n - mfccs.length;
                for (let i = 0; i < d; i++) {
                    mfccs.push(new Array(N_MFCC_COEFS - 1).fill(0));
                }
            } else if (mfccs.length > n) {
                mfccs = mfccs.slice(0, n);
            }
        } catch (e) {
            throw new Error(`Error standardizing mfcc vector length: ${e}`);
        }

        // transpose and reshape the data
        try {
            const data = tf.tensor(mfccs).transpose();

            // Save padded and transposed data to file for comparison with python results
            // this is the data that gets directly fed into the neurel network
            // const buffer = Array.from(data.dataSync());
            // const json = new Array(N_MFCC_COEFS - 1).fill([]).map((_, i) => buffer.slice(i * n, (i + 1) * n));
            // const pathParts = filename.split('/');
            // const f = pathParts[pathParts.length - 1].split(' ').join('_');
            // fs.writeFileSync(`/Users/jules/workspace/soundboy/python/notebooks/mfccs/${f}-mfccs.json`, JSON.stringify(json, null, 2));

            return data.reshape([1, N_MFCC_COEFS - 1, n, 1]);
        } catch (e) {
            throw new Error(`Error reshaping mfcc vector: ${e}`);
        }
    }

    /**
     * Main classification routine
     * @param raw
     */
    async classify(raw: number[][], filename?: string): Promise<string> {
        const data = this.preprocess(raw, filename);

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
