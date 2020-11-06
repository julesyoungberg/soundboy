import path from 'path';

import loadSoundFile from '../loadSoundFile';
import trimSamples from '../trimSamples';

jest.mock('meyda/dist/node', () => {
    return jest.createMockFromModule('meyda');
});

describe('trimSamples', () => {
    it.each([['clap.mp3'], ['kick.wav']])(`loading %s`, async (filename: string) => {
        console.log('loading sound file', filename);
        const buffer = await loadSoundFile(path.resolve(__dirname, `./sounds/${filename}`));
        console.log(`trimming samples for ${filename}: ${buffer.length} samples`);
        const samples = trimSamples(buffer);
        console.log(
            `trimmed result for ${filename}: ${samples.length} samples (${samples[0]}, ${samples[samples.length - 1]}`
        );
    });
});
