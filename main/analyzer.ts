import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import path from 'path';
import os from 'os';

import { AnalyzerMessage, IpcResponse } from '../@types';
import { TASKS_CHANNEL, RESULTS_CHANNEL } from '../constants';
import getSoundFiles from '../util/getSoundFiles';
import db from './db';

const NUM_WORKERS = Math.ceil(os.cpus().length / 2);

function createWorkerWindow() {
    const window = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    window.loadURL(`file://${path.resolve(__dirname, '../worker/dist/index.html')}`);
    return window;
}

/**
 * Main Thread Analyzer Logic
 * meant to persistently exist in the main thread,
 * spawns workers for tasks as they come in,
 * cleans up afterwards.
 */
export default class Analyzer {
    workers: BrowserWindow[];
    tasks: string[];
    callback?: (reply: IpcResponse) => void;

    constructor() {
        this.workers = [];
        this.tasks = [];
        this.resultHandler = this.resultHandler.bind(this);
    }

    /**
     * Initialize analyzation process
     * @param folder
     */
    async analyze(folder: string, callback: (reply: IpcResponse) => void) {
        if (this.workers.length > 0) {
            this.callback({ done: true, error: 'Analyzation already in progress' });
            return;
        }

        console.log('fetching sound files');
        this.tasks = await getSoundFiles(folder);
        const numTasks = this.tasks.length;
        this.callback = callback;

        ipcMain.on(RESULTS_CHANNEL, this.resultHandler);

        const numWorkers = Math.min(numTasks, NUM_WORKERS);
        console.log(`spawning ${numWorkers} workers`);
        // spawn workers and assign tasks
        for (let i = 0; i < numWorkers; i++) {
            const worker = createWorkerWindow();
            this.workers.push(worker);
            worker.webContents.on('dom-ready', () => this.assignTaskTo(i));
        }
    }

    /**
     * IPC handler for analyzer results.
     * handle the data appropriately, (save and/or forward),
     * then either assign next task or finish up
     * @param event
     * @param request
     */
    async resultHandler(event: IpcMainEvent, result: AnalyzerMessage) {
        try {
            if (!this.workers[result?.workerID]) {
                console.log('MISSING WORKER ID');
                // this is a message from an unknown worker
                return;
            }

            if (result.error) {
                console.error(result.error);
                this.callback({ error: result.error, result: result.sound });
            } else {
                // save correct data in the database and update the UI
                console.log('saving sound');
                await db.sounds.insert(result.sound);
                this.callback({ result: result.sound });
            }
        } catch (error) {
            console.error(error);
            this.callback({ error });
        }

        // assign next task
        if (this.tasks.length > 0) {
            console.log(`assigning task to ${result.workerID} over channel ${TASKS_CHANNEL}`);
            event.sender.send(TASKS_CHANNEL, this.taskAssignment(result.workerID));
        } else {
            // kill worker since there's no more work
            console.log('killing worker');
            this.workers[result.workerID]?.close();
            this.workers[result.workerID] = undefined;

            // check if done
            if (this.workers.every((worker) => worker === undefined)) {
                // this is the last worker, we're done here
                this.workers = [];
                console.log('analyzer finished');
                this.callback({ done: true });
            }
        }
    }

    private taskAssignment(workerID: number) {
        const filename = this.tasks.shift();
        return {
            sound: { filename },
            workerID,
        };
    }

    private assignTaskTo(id: number) {
        console.log(`Assigning task to ${id} over channel ${TASKS_CHANNEL}`);
        const worker = this.workers[id];
        worker.webContents.send(TASKS_CHANNEL, this.taskAssignment(id));
    }
}
