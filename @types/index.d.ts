declare module 'audio-loader';

declare module 'rebass';

declare module '@rebass/preset';

// read about the audio features here: https://meyda.js.org/audio-features
interface Sound {
    _id?: string;
    chroma?: number[];
    filename: string;
    instrument?: string;
    loudness?: {
        specific: Float32Array;
        total: number;
    };
    mfcc?: number[];
    perceptualSharpness?: number;
    perceptualSpread?: number;
    spectralCentroid?: number;
    spectralFlatness?: number;
    spectralFlux?: number;
    spectralSlope?: number;
    spectralRolloff?: number;
    spectralSpread?: number;
    spectralSkewness?: number;
    spectralKurtosis?: number;
}

interface IPCRequest {
    responseChannel?: string;
    params?: string[];
}

interface IPCResponse {
    done?: boolean;
    error?: string;
    result?: Sound;
    results?: Sound[];
}
