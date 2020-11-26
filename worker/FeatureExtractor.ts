import * as tf from '@tensorflow/tfjs';
// import fs from 'fs';
// eslint-disable-next-line
import Essentia from 'essentia.js/dist/core_api';
import meyda from 'meyda/dist/node/main';

import { ArrayFeature, Feature, Sound } from '../@types';

import Classifier from './Classifier';
import { N_MFCC_BANDS, N_MFCC_COEFS } from './config';

const FEATURES = [
    // Meyda Feaures
    'chroma',
    'loudness',
    'mfcc',
    'perceptualSpread',
    'perceptualSharpness',
    'rms',
    'spectralCentroid',
    'spectralFlatness',
    'spectralFlux', // breaks meyda - is supported by essentia
    // 'spectralSlope',
    'spectralRolloff',
    'spectralSpread',
    'spectralSkewness',
    'spectralKurtosis',

    // ML Features
    'instrument',
];

const ESSENTIA_FEATURES = [
    'mfcc',
    'rms',
    'spectralCentroid',
    'spectralFlatness',
    'spectralFlux',
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
    sampleRate?: number;
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
    spectralFlux: number[];
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
    spectralFlux: [],
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
    sampleRate = 22050;
    classifier: Classifier | undefined;
    essentia: Essentia | undefined;
    meydaFeatures: Record<string, boolean> = {};
    essentiaFeatures: Record<string, boolean> = {};

    constructor(config: FeatureExtractorOptions = {}) {
        if (config.features) this.features = config.features;
        if (config.frameSize) this.frameSize = config.frameSize;
        if (config.hopSize) this.hopSize = config.hopSize;
        if (config.sampleRate) this.sampleRate = config.sampleRate;

        if (this.features.includes('instrument')) {
            // this.features should only contain meyda features
            this.features = this.features.filter((feature) => feature !== 'instrument');
            this.classifier = new Classifier();
        }

        this.features.forEach((feature) => {
            if (ESSENTIA_FEATURES.includes(feature)) {
                this.essentiaFeatures[feature] = true;
            } else {
                this.meydaFeatures[feature] = true;
            }
        });
    }

    ready() {
        return !!this.essentia && (!this.classifier || this.classifier.ready());
    }

    async setup() {
        console.log('FEATURE EXTRACTOR SETUP');
        const essentiaWASM = await (window as any).EssentiaWASM();
        this.essentia = new (window as any).Essentia(essentiaWASM);
        await this.classifier?.setup();
    }

    window(signal: any) {
        const { frame } = this.essentia.Windowing(
            signal,
            undefined, // normalized
            this.frameSize, // window size
            'hann', // window type
            0, // zero padding
            undefined // zero phase
        );
        return frame;
    }

    getMFCC(spectrum: any) {
        return this.essentia.MFCC(
            // also returns bands
            spectrum,
            undefined, // dctType
            undefined, // highFrequencyBound
            undefined, // inputSize
            undefined, // liftering
            undefined, // logType
            undefined, // lowFrequencyBound
            undefined, // normalize
            N_MFCC_BANDS, // numberBands?: number,
            N_MFCC_COEFS, // numberCoefficients?: number,
            this.sampleRate, // sampleRate?: number,
            undefined, // silenceThreshold?: number,
            undefined, // type?: string,
            undefined, // warpingFormula?:
            undefined // string, weighting?: string
        );
    }

    /**
     * hops through buffer analyzing each window
     * @param buffer
     */
    async getFeatureTracks(buffer: Float32Array): Promise<FeatureTracks> {
        if (!this.ready()) {
            await this.setup();
        }

        const results = initialFeatureTracks();
        meyda.bufferSize = this.frameSize;
        meyda.sampleRate = this.sampleRate;
        meyda.numberOfMFCCCoefficients = N_MFCC_COEFS;
        meyda.mellBands = N_MFCC_BANDS;
        let prevFrame = new Float32Array(this.frameSize).fill(0);
        const meydaFeaturs = Object.keys(this.meydaFeatures);

        // use essentia to generate frames
        console.log('getting frames');
        const frames = this.essentia.FrameGenerator(buffer, this.frameSize, this.hopSize);

        // step through signal
        console.log('stepping through signal');
        for (let i = 0; i < frames.size(); i++) {
            const frame = this.window(frames.get(i));
            const { spectrum } = this.essentia.Spectrum(frame, this.frameSize);

            // compute essentia features
            if (this.essentiaFeatures.loudness) {
                const { loudness } = this.essentia.Loudness(frame);
                results.loudness.push(loudness);
            }

            if (this.essentiaFeatures.mfcc) {
                const { mfcc } = this.getMFCC(spectrum);
                results.mfcc.push(Array.from(this.essentia.vectorToArray(mfcc)));
            }

            if (this.essentiaFeatures.rms) {
                const { rms } = this.essentia.RMS(frame);
                results.rms.push(rms);
            }

            if (this.essentiaFeatures.spectralCentroid) {
                const { centroid } = this.essentia.Centroid(spectrum);
                results.spectralCentroid.push(centroid);
            }

            if (this.essentiaFeatures.spectralFlatness) {
                const { flatness } = this.essentia.FlatnessDB(spectrum);
                results.spectralFlatness.push(flatness);
            }

            if (this.essentiaFeatures.spectralFlux) {
                const { flux } = this.essentia.Flux(spectrum);
                results.spectralFlux.push(flux);
            }

            if (this.essentiaFeatures.spectralRolloff) {
                const { rolloff } = this.essentia.RollOff(spectrum, undefined, this.sampleRate);
                results.spectralRolloff.push(rolloff);
            }

            if (
                this.essentiaFeatures.spectralSpread ||
                this.essentiaFeatures.spectralSkewness ||
                this.essentiaFeatures.spectralKurtosis
            ) {
                const { centralMoments } = this.essentia.CentralMoments(spectrum);
                const { kurtosis, skewness, spread } = this.essentia.DistributionShape(centralMoments);

                if (this.essentiaFeatures.spectralSpread) {
                    results.spectralSpread.push(spread);
                }

                if (this.essentiaFeatures.spectralSkewness) {
                    results.spectralSkewness.push(skewness);
                }

                if (this.essentiaFeatures.spectralKurtosis) {
                    results.spectralKurtosis.push(kurtosis);
                }
            }

            // meyda features
            if (meydaFeaturs.length > 0) {
                const samples = this.essentia.vectorToArray(frames.get(i));
                const features = meyda.extract(meydaFeaturs, samples, prevFrame);
                prevFrame = samples;
                Object.keys(features).forEach((feature) => {
                    results[feature]?.push(features[feature]);
                });
            }
        }

        console.log('computed feature tracks');

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
            if (featureTrack.length === 0) {
                return result;
            }

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
     * @param mfccs
     */
    async getInstrument(mfccs: number[][]): Promise<string | undefined> {
        if (!(this.classifier && mfccs && mfccs.length > 0)) {
            return undefined;
        }

        const instrument = await this.classifier.classify(mfccs);
        return instrument;
    }

    /**
     * Main algorithm that takes a signal buffer and returns feature stats
     * @param buffer
     */
    async getFeatures(buffer: Float32Array, filename: string): Promise<Sound> {
        // const pathParts = filename.split('/');
        // const f = pathParts[pathParts.length - 1].split(' ').join('_');
        // fs.writeFileSync(`/Users/jules/workspace/soundboy/${f}-samples.json`, JSON.stringify(Array.from(buffer), null, 2));
        console.log('computing features');
        let featureTracks: FeatureTracks = initialFeatureTracks();
        try {
            featureTracks = await this.getFeatureTracks(buffer);
        } catch (e) {
            throw new Error(`Error extracting features from '${filename}': ${e}`);
        }

        console.log('computing stats', featureTracks);
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

        if (featureTracks.mfcc && this.classifier) {
            console.log('classifying');
            // fs.writeFileSync(`/Users/jules/workspace/soundboy/${f}-mfcc.json`, JSON.stringify(mfccs, null, 2));
            result.instrument = await this.getInstrument(featureTracks.mfcc);
        }

        return result;
    }
}
