declare module 'audio-loader';

declare module 'rebass';

declare module '@rebass/preset';

// read about the audio features here: https://meyda.js.org/audio-features
interface Sound {
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

interface AnalyzerMessage {
    done?: boolean;
    error?: string;
    result?: Sound;
}

interface SoundsMessage {
    error?: string;
    results?: Sound[];
}

interface IPCRequest {
    responseChannel?: string;
    params?: string[];
}
