import { spawn, Pool, Worker } from 'threads';

import db from '../db';
import getAppPath from '../../util/getAppPath';

/**
 * Recursively finds all the sound files (mp3, wav, aif) in the given folder
 * @param folder 
 * @returns an array of sound file names
 */
function getSoundFiles(folder: string): string[] {
    return [folder];
}

/**
 * This function spawns a worker thread to analyze the given sound files
 * @param folder
 * @param callback called after each analysis
 */
export async function analyzeSounds(folder: string, callback: (data: Record<string, any>) => void) {
    console.log('spawning analyzer worker');

    const pool = Pool(() => spawn(new Worker(`${getAppPath()}/main/analyzer/worker`)), 8);

    getSoundFiles(folder).forEach((filename) => {
        pool.queue(async (analyzer) => {
            let result: Record<string, any> = {};

            try {
                result = await analyzer.analyze(filename);
                await db.sounds.insert(result);
            } catch (error) {
                console.error(error);
                result = { error };
            }

            callback({ result });
        });
    });

    await pool.settled();
    callback({ done: true });
}
