// import glob from 'glob-promise';
import AnalyzerWorker from 'worker-loader?filename=static/[hash].worker.js!./analyzer.worker';

/**
 * Recursively finds all the sound files (mp3, wav, aif) in the given folder
 * @param folder
 * @returns an array of sound file names
 */
function getSoundFiles(folder: string) {
    return ['sound.wav']; //glob.promise(`${folder}/**/*.{mp3,wav,aif,flac}`);
}

/**
 * This function spawns a worker thread to analyze the given sound files
 * @param folder
 * @param callback called after each analysis
 */
export async function analyzeSounds(folder: string, callback: (data: IPCResponse) => void) {
    console.log('spawning analyzer worker');

    const worker = new AnalyzerWorker();
    worker.postMessage(folder);

    // // TODO avoid using ..
    // const pool = Pool(() => spawn(new Worker()), 8);

    // // add every sound file in the folder to the queue
    // getSoundFiles(folder).forEach((filename) => {
    //     pool.queue(async (analyzer) => {
    //         try {
    //             const result = await analyzer.analyze(filename);
    //             callback({ result });
    //         } catch (error) {
    //             callback({ error, result: { filename } });
    //         }
    //     });
    // });

    // await pool.settled();
    callback({ done: true });
}

export async function analyze(folder: string) {
    analyzeSounds(folder, (data: IPCResponse) => console.log(data));
}
