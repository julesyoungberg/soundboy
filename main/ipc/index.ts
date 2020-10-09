import { ipcMain } from 'electron';

import AnalyzerChannel from './AnalyzerChannel';
import Channel from './Channel';
import SoundsChannel from './SoundsChannel';

const channels: Channel[] = [new AnalyzerChannel('analyze'), new SoundsChannel('sounds')];

export function registerIpcChannels() {
    console.log('Registering IPC Channels');

    channels.forEach((channel) => {
        console.log(`Registering channel '${channel.name}'`);
        // register the ipc channel to the main process with it's corresponding handler
        ipcMain.on(channel.name, (event, request) => {
            channel.handler(event, request);
        });
    });
}
