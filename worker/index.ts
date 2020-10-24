import { IpcRendererEvent } from 'electron';

import { AnalyzerMessage } from '../@types';
import { TASKS_CHANNEL, RESULTS_CHANNEL } from '../constants';

import analyze from './analyze';

const electron = window.require('electron');
const { ipcRenderer } = electron;

console.log(`Listening for tasks on channel: ${TASKS_CHANNEL}`);

/**
 * Main worker logic
 * given a filename, load it, analyze it, return the results
 */
ipcRenderer.on(TASKS_CHANNEL, async (_event: IpcRendererEvent, raw: string) => {
    console.log('Received task', raw);
    let data: AnalyzerMessage | undefined;
    try {
        data = JSON.parse(raw);
    } catch (error) {
        console.error(error);
        ipcRenderer.send(RESULTS_CHANNEL, JSON.stringify({ error }));
        return;
    }

    console.log('worker ID: ', data.workerID);

    const reply = (res: Partial<AnalyzerMessage>) => {
        const response = {
            ...res,
            workerID: data.workerID,
        };
        console.log('responding with:', response);
        ipcRenderer.send(RESULTS_CHANNEL, JSON.stringify(response));
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
        reply({ error });
    }
});
