// import { Pool, spawn } from 'threads';

import { IpcResponse } from '../../../@types';
// import getSoundFiles from '../../../util/getSoundFiles';

// eslint-disable-next-line
// import AnalyzerWorker from 'worker-loader?filename=static/[hash].worker.js!./analyzer.worker';

/**
 * This function spawns a worker thread to analyze the given sound files
 * @param folder
 * @param callback called after each analysis
 */
export async function analyzeSounds(folder: string, callback: (data: IpcResponse) => void) {
    console.log('spawning analyzer worker');

    // const soundfiles = await getSoundFiles(folder);

    // const pool = Pool(() => spawn(new AnalyzerWorker()), 8);

    // soundfiles.forEach((filename) => {
    //     pool.queue(async (analyzer) => {
    //         try {
    //             const result = await analyzer.analyze(filename);
    //             // await db.sounds.insert(result);
    //             callback({ result });
    //         } catch (error) {
    //             callback({ error, result: { filename } });
    //         }
    //     });
    // });

    // await pool.settled();
    callback({ done: true });
}
