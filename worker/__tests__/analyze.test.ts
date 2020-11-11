import path from 'path';

import analyze from '../analyze';

describe('analyze', () => {
    it.each([['clap.mp3'], ['kick.wav'], ['bonga.wav']])(`loading %s`, async (filename: string) => {
        const result = await analyze(path.resolve(__dirname, `./sounds/${filename}`), true);
        console.log(result);
    });
});
