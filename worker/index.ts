import { IpcRendererEvent } from 'electron';

import { AnalyzerMessage } from '../@types';
import { TASKS_CHANNEL, RESULTS_CHANNEL } from '../constants';

import analyze from './analyze';

const electron = window.require('electron');
const { ipcRenderer } = electron;

const state = { busy: false };

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

    if (state.busy) {
        reply({ error: 'busy' });
        return;
    }

    if (!data.sound.filename) {
        reply({ error: 'Missing filename' });
        return;
    }

    try {
        state.busy = true;
        console.log('analyzing');
        const sound = await analyze(data.sound.filename);
        console.log('analyzed: ', sound);
        reply({ sound });
    } catch (error) {
        console.error(error);
        reply({ error, sound: data.sound });
    }

    state.busy = false;
});

console.log(`Listening for tasks on channel: ${TASKS_CHANNEL}`);
