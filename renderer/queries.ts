/**
 * This file defines the UI filters and their corresponding DB queries
 */
export default {
    brightness(value: string) {
        const mid = 0.15;
        const stability = { 'spectralCentroid.std': { $lte: 0.1 } };

        switch (value) {
            case 'Bright':
                return { 'spectralCentroid.mean': { $gte: mid }, ...stability };
            case 'Dark':
                return { 'spectralCentroid.mean': { $gt: 0, $lte: mid }, ...stability };
            default:
                return {};
        }
    },

    fullness(value: string) {
        const mid = 0.5;
        const stability = { 'perceptualSpread.std': { $lte: 0.01 } };

        switch (value) {
            case 'Full':
                return { 'perceptualSpread.mean': { $gte: mid }, ...stability };
            case 'Hollow':
                return { 'perceptualSpread.mean': { $gt: 0, $lte: mid }, ...stability };
            default:
                return {};
        }
    },

    instrument(instrument: string) {
        return { instrument };
    },

    loudness(value: string) {
        const mid = 12.0;
        switch (value) {
            case 'Loud':
                return { 'loudness.mean': { $gte: mid } };
            case 'Quiet':
                return { 'loudness.mean': { $gt: 0, $lte: mid } };
            default:
                return {};
        }
    },

    name(value: string) {
        if (!value) {
            return {};
        }

        return { filename: { $regex: new RegExp(value, 'i') } };
    },

    noisiness(value: string) {
        const mid = 0.1;
        switch (value) {
            case 'Noisy':
                return { 'spectralFlatness.mean': { $gte: mid } };
            case 'Soft':
                return { 'spectralFlatness.mean': { $gt: 0, $lte: mid } };
            default:
                return {};
        }
    },

    pitch(pitch: string) {
        return { pitch };
    },

    pitchiness(value: string) {
        const mid = 0.4;
        switch (value) {
            case 'Tonal':
                return { 'spectralKurtosis.mean': { $gte: mid } };
            case 'Atonal':
                return { 'spectralKurtosis.mean': { $gt: 0, $lte: mid } };
            default:
                return {};
        }
    },

    roughness(value: string) {
        const mid = 0.1;
        const stability = { 'spectralFlux.std': { $lte: 0.2 } };

        switch (value) {
            case 'Rough':
                return { 'spectralFlux.mean': { $gte: mid }, ...stability };
            case 'Smooth':
                return { 'spectralFlux.mean': { $gt: 0, $lte: mid }, ...stability };
            default:
                return {};
        }
    },

    sharpness(value: string) {
        const mid = 1.0;
        const stability = { 'perceptualSharpness.std': { $lte: 0.3 } };

        switch (value) {
            case 'Sharp':
                return { 'perceptualSharpness.mean': { $gte: mid }, ...stability };
            case 'Dull':
                return { 'perceptualSharpness.mean': { $gt: 0, $lte: mid }, ...stability };
            default:
                return {};
        }
    },
};
