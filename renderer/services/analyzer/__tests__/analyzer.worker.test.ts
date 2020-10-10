import path from 'path';

import { analyze } from '../analyzer.worker';

jest.mock('meyda/dist/node', () => {
    return jest.createMockFromModule('meyda');
});

describe('analyze', () => {
    it.each([
        ['clap.mp3'],
        ['kick.wav'],
        ['shaker.aiff']
    ])(`analyzes %s`, async (filename: string) => {
        await analyze(path.resolve(__dirname, `./sounds/${filename}`));
    });
});
