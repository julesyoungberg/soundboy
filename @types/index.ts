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
    spectralSpread?: Feature;
    spectralSkewness?: Feature;
    spectralKurtosis?: Feature;
}

export interface IpcRequest {
    responseChannel?: string;
    params?: string[];
}

export interface IpcResponse {
    done?: boolean;
    error?: string;
    result?: Sound;
    results?: Sound[];
}

export interface AnalyzerMessage {
    error?: string;
    sound?: Sound;
    workerID: number;
}
