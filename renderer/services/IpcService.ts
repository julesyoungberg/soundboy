import React from 'react';
import { IpcRenderer } from 'electron';

export default class IpcService {
    private ipcRenderer?: IpcRenderer;

    // ipcRenderer must be required after the app is fully up and running
    private initializeIpcRenderer() {
        if (!window || !window.process || !window.require) {
            throw new Error(`Unable to require renderer process`);
        }
        this.ipcRenderer = window.require('electron').ipcRenderer;
    }

    send<T>(channel: string, request: IPCRequest = {}): Promise<T> {
        console.log('sending to', channel);
        // If the ipcRenderer is not available try to initialize it
        if (!this.ipcRenderer) {
            this.initializeIpcRenderer();
        }
        // If there's no responseChannel let's auto-generate it
        if (!request.responseChannel) {
            request.responseChannel = `${channel}_response_${new Date().getTime()}`;
        }

        const { ipcRenderer } = this;
        ipcRenderer.send(channel, request);

        // This method returns a promise which will be resolved when the response has arrived.
        return new Promise((resolve) => {
            ipcRenderer.once(request.responseChannel, (_event, response) => resolve(response));
        });
    }

    analyze(folder: string) {
        // TODO: use this.getstream to receive all streamed results
        return this.send<AnalyzerMessage>('analyze', { params: [folder] });
    }

    getSounds(query: Record<string, any>) {
        return this.send<SoundsMessage>('sounds', { params: [JSON.stringify(query)] });
    }
}

export const IpcContext = React.createContext<IpcService | undefined>(undefined);
