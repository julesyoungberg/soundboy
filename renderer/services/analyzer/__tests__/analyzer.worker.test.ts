import path from 'path';

import { loadSound } from '../analyzer.worker';

describe('loadSound', () => {
    it.each([
        ['clap.mp3'],
        ['kick.wav'],
        ['shaker.aiff']
    ])(`can load %s`, async (filename: string) => {
        await loadSound(path.resolve(__dirname, `./sounds/${filename}`));
    });
});
