export default {
    instrument(value: string) {
        return {};
    },
    pitch(pitch: string) {
        return { pitch };
    },

    brightness(value: string) {
        switch (value) {
            case 'Bright':
                return { 'spectralCentroid.mean': { $gte: 400 } };
            case 'Dark':
                return { 'spectralCentroid.mean': { $lte: 200 } };
            default:
                return {};
        }
    },
};
