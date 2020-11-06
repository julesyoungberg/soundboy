import path from 'path';

import loadSoundFile from '../loadSoundFile';

jest.mock('meyda/dist/node', () => {
    return jest.createMockFromModule('meyda');
});

describe('loadSoundFile', () => {
    it.each([['clap.mp3'], ['kick.wav'], ['bonga.wav']])(`loading %s`, async (filename: string) => {
        const buffer = await loadSoundFile(path.resolve(__dirname, `./sounds/${filename}`));
        console.log(buffer);
    });
});
