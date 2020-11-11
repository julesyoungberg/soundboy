import { UrlObject } from 'url';

export type Url = string | UrlObject;

export interface Feature {
    mean: number;
    std: number;
}

export interface ArrayFeature {
    mean: number[];
    std: number[];
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
    pitch?: string;
    spectralCentroid?: Feature;
    spectralFlatness?: Feature;
    spectralFlux?: Feature;
    spectralSlope?: Feature;
    spectralRolloff?: Feature;
    spectralSpread?: Feature;
    spectralSkewness?: Feature;
    spectralKurtosis?: Feature;
}

export interface IpcRequest {
    params?: any[];
}

export interface IpcResponse {
    done?: boolean;
    error?: string;
    result?: Sound;
    results?: Sound[];
    count?: number;
}

export interface AnalyzerMessage {
    error?: string;
    sound?: Sound;
    workerID: number;
}
