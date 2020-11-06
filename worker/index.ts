import { IpcRendererEvent } from 'electron';

import { AnalyzerMessage, Sound } from '../@types';
import { TASKS_CHANNEL, RESULTS_CHANNEL } from '../constants';

import FeatureExtractor from './FeatureExtractor';
import loadSoundFile from './loadSoundFile';
import trimSamples from './trimSamples';

const electron = window.require('electron');
const { ipcRenderer } = electron;

const SAMPLE_RATE = 22050;
const FRAME_SIZE = 2048;
const HOP_SIZE = 1024;
const MAX_CLIP_LENGTH = 5; // seconds

const extractor = new FeatureExtractor({
    frameSize: FRAME_SIZE,
    hopSize: HOP_SIZE,
});

/**
 * Appends the desired number of zeros onto the input buffer
 * @param input
 * @param numZeros
 */
function zeroPad(input: Float32Array, numZeros: number) {
    const output = new Float32Array(input.length + numZeros).fill(0);
    for (let i = 0; i < input.length; i++) {
        output[i] = input[i];
    }

    return output;
}

/**
 * Standardize the length of the input buffer to fit within the frame size and max length
 * @param input
 */
function standardize(input: Float32Array) {
    const min = FRAME_SIZE;
    const max = MAX_CLIP_LENGTH * SAMPLE_RATE;

    if (input.length < min) {
        return zeroPad(input, min - input.length);
    }

    if (input.length > max) {
        return input.subarray(0, max);
    }

    return input;
}

/**
 * Main worker function for analyzing a sound file
 * @param filename
 * @returns sound analysis data
 */
export default async function analyze(filename: string): Promise<Sound> {
    console.log('Analyze Worker - filename: ', filename);

    let buffer = await loadSoundFile(filename, SAMPLE_RATE);
    buffer = standardize(trimSamples(buffer));

    return extractor.getFeatures(buffer, filename);
}

/**
 * Main worker logic
 * given a filename, load it, analyze it, return the results
 */
ipcRenderer.on(TASKS_CHANNEL, async (event: IpcRendererEvent, data: AnalyzerMessage) => {
    console.log('Received task - worker ID: ', data.workerID);

    const reply = (res: Partial<AnalyzerMessage>) => {
        const response = {
            ...res,
            workerID: data.workerID,
        };
        console.log('responding with:', response);
        event.sender.send(RESULTS_CHANNEL, response);
    };

    if (!data.sound.filename) {
        reply({ error: 'Missing filename' });
        return;
    }

    try {
        console.log('analyzing');
        const sound = await analyze(data.sound.filename);
        console.log('analyzed: ', sound);
        reply({ sound });
    } catch (error) {
        console.error(error);
        reply({ error, sound: data.sound });
    }
});

console.log(`Listening for tasks on channel: ${TASKS_CHANNEL}`);
