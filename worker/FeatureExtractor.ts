import * as tf from '@tensorflow/tfjs';
import meyda from 'meyda/dist/node/main';

import { ArrayFeature, Feature, Sound } from '../@types';

const FEATURES = [
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

    constructor(config: FeatureExtractorOptions = {}) {
        if (config.features) this.features = config.features;
        if (config.frameSize) this.frameSize = config.frameSize;
        if (config.hopSize) this.hopSize = config.hopSize;
    }

    /**
     * hops through buffer analyzing each window
     * @param buffer
     */
    getFeatureTracks(buffer: Float32Array): FeatureTracks {
        const results = initialFeatureTracks();
        meyda.bufferSize = this.frameSize;
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
     * Main algorithm that takes a signal buffer and returns feature stats
     * @param buffer
     */
    getFeatures(buffer: Float32Array, filename: string): Sound {
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

        return result;
    }
}
