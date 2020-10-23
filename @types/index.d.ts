import { NumericDataType } from "@tensorflow/tfjs-node";

declare module 'audio-loader';

declare module 'rebass';

declare module '@rebass/preset';

export interface Feature {
    mean: number;
    variance: number;
}

export interface ArrayFeature {
    mean: number[];
    variance: number[];
}

// read about the audio features here: https://meyda.js.org/audio-features
export interface Sound {
    _id?: string;
    filename: string;
    chroma?: ArrayFeature;
    instrument?: Feature;
    loudness?: Feature;
    mfcc?: ArrayFeature;
    perceptualSharpness?: Feature;
    perceptualSpread?: Feature;
    spectralCentroid?: Feature;
    spectralFlatness?: Feature;
    spectralFlux?: Feature;
    spectralSlope?: Feature;
    spectralRolloff?: Feature;
    spectralSpread?: Fature;
    spectralSkewness?: Feature;
    spectralKurtosis?: Feature;
}

export interface IPCRequest {
    responseChannel?: string;
    params?: string[];
}

export interface IPCResponse {
    done?: boolean;
    error?: string;
    result?: Sound;
    results?: Sound[];
}
