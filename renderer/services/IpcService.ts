import React from 'react';
import { IpcRenderer } from 'electron';
import Stream from 'stream';

import { IpcRequest, IpcResponse } from '../../@types';

export default class IpcService {
    private ipcRenderer?: IpcRenderer;

    // ipcRenderer must be required after the app is fully up and running
    private initializeIpcRenderer() {
        if (!window || !window.process || !window.require) {
            throw new Error(`Unable to require renderer process`);
        }
        this.ipcRenderer = window.require('electron').ipcRenderer;
        // hacky public exposure of this function for console experimentation
        (window as any).getSounds = this.getSounds.bind(this);
    }

    /**
     * Generic IPC channel send logic
     * @param channel
     * @param request
     */
    send(channel: string, request: IpcRequest = {}) {
        console.log('sending to', channel);
        // If the ipcRenderer is not available try to initialize it
        if (!this.ipcRenderer) {
            this.initializeIpcRenderer();
        }
        // If there's no responseChannel let's auto-generate it
        if (!request.responseChannel) {
            request.responseChannel = `${channel}_response_${new Date().getTime()}`;
        }

        this.ipcRenderer.send(channel, request);
    }

    /**
     * This method returns a promise which will be resolved when the response has arrived.
     * @param channel
     * @param request
     */
    fetch(channel: string, request: IpcRequest = {}): Promise<IpcResponse> {
        this.send(channel, request);
        return new Promise((resolve) => {
            this.ipcRenderer.once(request.responseChannel, (_event, response) => resolve(JSON.parse(response)));
        });
    }

    /**
     * generator function that yields all IPC responses to request
     * @param channel
     * @param request
     * @param callback
     */
    getStream(channel: string, request: IpcRequest): Stream.Readable {
        const stream = new Stream.Readable();
        this.send(channel, request);
        // listen until a response with done==true is received
        const responseListener = (_event: any, res: string) => {
            const response = JSON.parse(res);
            if (response.done) {
                this.ipcRenderer.removeListener(request.responseChannel, responseListener);
            }
            stream.push(response);
        };

        this.ipcRenderer.on(request.responseChannel, responseListener);
        return stream;
    }

    async clearSounds() {
        await this.fetch('clear_sounds', {});
    }

    async analyze(folder: string, callback?: (data: IpcResponse) => void) {
        const resultsStream = this.getStream('analyze_sounds', { params: [folder] });
        let data: IpcResponse | undefined;
        // eslint-disable-next-line
        for await (data of resultsStream) {
            if (data.error) {
                console.error(`Error analyzing '${data.result?.filename}'`);
                console.error(data.error);
            } else {
                console.log(`Analyzed ${data.result?.filename}`);
            }
            callback?.(data);
        }
    }

    async getSounds(query: Record<string, any>) {
        const result = await this.fetch('fetch_sounds', {
            params: [JSON.stringify(query)],
        });
        return result;
    }
}

export const IpcContext = React.createContext<IpcService | undefined>(undefined);
