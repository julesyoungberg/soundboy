import debounce from 'lodash.debounce';
import { IpcRendererEvent } from 'electron';

import { AnalyzerMessage } from '../@types';
import { TASKS_CHANNEL, RESULTS_CHANNEL } from '../constants';

import analyze from './analyze';

const electron = window.require('electron');
const { ipcRenderer } = electron;

/**
 * Main worker logic
 * given a filename, load it, analyze it, return the results
*/
async function handler(event: IpcRendererEvent, data: AnalyzerMessage) {
    console.log(`Received task - worker ID: ${data.workerID}`);

    const reply = (res: Partial<AnalyzerMessage>) => {
        const response = {
            ...res,
            workerID: data.workerID,
        };
        console.log('responding with:', response);
        event.sender.send(RESULTS_CHANNEL, response);
        register();
    };

    if (!data.sound.filename) {
        reply({ error: 'Missing filename' });
        return;
    }

    try {
        const sound = await analyze(data.sound.filename);
        console.log('analyzed: ', sound);
        reply({ sound });
    } catch (error) {
        console.error(error);
        reply({ error, sound: data.sound });
    }
}

function register() {
    console.log(`Listening for tasks on channel: ${TASKS_CHANNEL}`);
    // use once and throttle to prevent duplicate messages
    ipcRenderer.once(TASKS_CHANNEL, handler);
}

register();
