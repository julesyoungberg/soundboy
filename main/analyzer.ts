import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import path from 'path';
import os from 'os';

import { AnalyzerMessage, IpcResponse } from '../@types';
import { TASKS_CHANNEL, RESULTS_CHANNEL } from '../constants';
import getSoundFiles from '../util/getSoundFiles';
import db from './db';

const NUM_WORKERS = Math.ceil(os.cpus().length);

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

interface Task {
    attempts: number;
    filename: string;
    status: 'queued' | 'inprogress' | 'completed';
}

/**
 * Main Thread Analyzer Logic
 * meant to persistently exist in the main thread,
 * spawns workers for tasks as they come in,
 * cleans up afterwards.
 */
export default class Analyzer {
    workers: BrowserWindow[];
    tasks: Task[];
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
        const filenames = await getSoundFiles(folder);
        this.tasks = filenames.map((filename) => ({
            attempts: 0,
            filename,
            status: 'queued',
        }));
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
                let error = result.error;
                if (typeof error === 'object') {
                    error = (error as any).message;
                }

                // requeue task
                let returnError = true;
                if (result.sound?.filename) {
                    for (let i = 0; i < this.tasks.length; i++) {
                        const task = this.tasks[i];
                        if (task.filename === result.sound.filename && task.attempts < 3) {
                            this.tasks[i].status = 'queued';
                            returnError = false;
                            break;
                        }
                    }
                }

                console.error(result.error);

                if (returnError) {
                    this.callback({ error: result.error, result: result.sound });
                }
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

        const task = this.getTaskFor(result.workerID);

        // assign next task
        if (task) {
            event.sender.send(TASKS_CHANNEL, task);
        } else {
            // kill worker since there's no more work
            console.log('killing worker');
            // this.workers[result.workerID]?.close();
            this.workers[result.workerID] = undefined;

            // check if done
            if (this.workers.every((worker) => worker === undefined)) {
                // this is the last worker, we're done here
                this.workers = [];
                this.tasks = [];
                console.log('analyzer finished');
                this.callback({ done: true });
            }
        }
    }

    private getTaskFor(workerID: number) {
        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            if (task.status === 'queued') {
                this.tasks[i].status = 'inprogress';
                this.tasks[i].attempts += 1;
                console.log(`Assigning ${task.filename} to ${workerID}`);
                return { sound: { filename: task.filename }, workerID };
            }
        }

        return undefined;
    }

    private assignTaskTo(id: number) {
        const worker = this.workers[id];
        worker.webContents.send(TASKS_CHANNEL, this.getTaskFor(id));
    }
}
