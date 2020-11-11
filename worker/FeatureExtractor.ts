import * as tf from '@tensorflow/tfjs';
import meyda from 'meyda/dist/node/main';

import { ArrayFeature, Feature, Sound } from '../@types';

import Classifier, { N_MFCCS } from './Classifier';

const FEATURES = [
    // Meyda Feaures
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

    // ML Features
    'instrument',
];

const PITCHES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface FeatureExtractorOptions {
    features?: string[];
    frameSize?: number;
    hopSize?: number;
}

interface FeatureTracks {
    chroma: number[][];
    loudness: number[];
    mfcc: number[][];
    perceptualSharpness: number[];
    perceptualSpread: number[];
    rms: number[];
    spectralCentroid: number[];
    spectralFlatness: number[];
    // spectralFlux: number[];
    spectralSlope: number[];
    spectralRolloff: number[];
    spectralSpread: number[];
    spectralSkewness: number[];
    spectralKurtosis: number[];
}

const initialFeatureTracks = (): FeatureTracks => ({
    chroma: [],
    loudness: [],
    mfcc: [],
    perceptualSharpness: [],
    perceptualSpread: [],
    rms: [],
    spectralCentroid: [],
    spectralFlatness: [],
    // spectralFlux: [],
    spectralSlope: [],
    spectralRolloff: [],
    spectralSpread: [],
    spectralSkewness: [],
    spectralKurtosis: [],
});

/**
 * Feaure Extractor class
 * - allows configuration to be shared between sounds
 * - holds the core signal processes logic for Soundboy
 */
export default class FeatureExtractor {
    features: string[] = FEATURES;
    frameSize = 2048;
    hopSize = 1024;
    classifier: Classifier | undefined;

    constructor(config: FeatureExtractorOptions = {}) {
        if (config.features) this.features = config.features;
        if (config.frameSize) this.frameSize = config.frameSize;
        if (config.hopSize) this.hopSize = config.hopSize;

        if (this.features.includes('instrument')) {
            // this.features should only contain meyda features
            this.features = this.features.filter((feature) => feature !== 'instrument');
            this.classifier = new Classifier();
        }
    }

    async setup() {
        await this.classifier?.setup();
    }

    /**
     * hops through buffer analyzing each window
     * @param buffer
     */
    getFeatureTracks(buffer: Float32Array): FeatureTracks {
        const results = initialFeatureTracks();
        meyda.bufferSize = this.frameSize;
        meyda.numberOfMFCCCoefficients = N_MFCCS;
        let prevFrame = new Float32Array();

        // hop through buffer
        for (let offset = 0; offset < buffer.length; offset += this.hopSize) {
            // get frame from buffer
            const end = Math.min(buffer.length, offset + this.frameSize);
            const frame = new Float32Array(this.frameSize).fill(0);
            frame.set(buffer.slice(offset, end));

            const features = meyda.extract(this.features, frame, prevFrame);
            prevFrame = frame;

            // push features to appropriate tracks
            this.features.forEach((feature) => {
                const val = features[feature];

                if (feature === 'loudness') {
                    results[feature]?.push(val.total);
                } else {
                    results[feature]?.push(val);
                }
            });
        }

        return results;
    }

    /**
     * computes stats for each feature
     * @param featureTracks
     */
    computeFeatureStats(featureTracks: FeatureTracks): Partial<Sound> {
        return this.features.reduce((result, feature) => {
            const featureTrack = featureTracks[feature].map((item: number | number[]) =>
                Array.isArray(item) || !Number.isNaN(item) ? item : 0
            );
            const t = tf.tensor(featureTrack);
            // compute stats
            const stats = tf.moments(t, [0]);
            const mean = stats.mean.dataSync();
            const std = stats.variance.sqrt().dataSync();
            let data: Feature | ArrayFeature | undefined;

            if (['chroma', 'mfcc'].includes(feature)) {
                // convert array featurs to plain array
                data = {
                    mean: Array.from(mean),
                    std: Array.from(std),
                };
            } else {
                // get single value for regular features
                data = {
                    mean: mean[0],
                    std: std[0],
                };
            }

            return { ...result, [feature]: data };
        }, {});
    }

    /**
     * High level classification algorithm
     * @param featureTracks
     */
    async getInstrument({ mfcc }: FeatureTracks): Promise<string | undefined> {
        if (!(this.classifier && mfcc && mfcc.length > 0)) {
            return undefined;
        }

        try {
            // lazily setup classifier
            if (!this.classifier.ready()) {
                await this.classifier.setup();
            }
        } catch (e) {
            throw new Error(`Error loading classification model: ${e}`);
        }

        const instrument = await this.classifier.classify(mfcc);
        return instrument;
    }

    /**
     * Main algorithm that takes a signal buffer and returns feature stats
     * @param buffer
     */
    async getFeatures(buffer: Float32Array, filename: string): Promise<Sound> {
        let featureTracks: FeatureTracks = initialFeatureTracks();
        try {
            featureTracks = this.getFeatureTracks(buffer);
        } catch (e) {
            throw new Error(`Error extracting features from '${filename}': ${e}`);
        }

        let result: Sound = { filename };
        try {
            const features = this.computeFeatureStats(featureTracks);
            result = { ...features, filename };
        } catch (e) {
            throw new Error(`Error aggregating feature tracks from '${filename}': ${e}`);
        }

        try {
            if (result.chroma) {
                const t = tf.tensor(result.chroma.mean);
                const pitchIndex = t.argMax().dataSync()[0];
                result.pitch = PITCHES[pitchIndex];
            }
        } catch (e) {
            throw new Error(`Error detecting pitch from '${filename}': ${e}`);
        }

        result.instrument = await this.getInstrument(featureTracks);

        return result;
    }
}
