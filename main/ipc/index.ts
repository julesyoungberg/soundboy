import { ipcMain } from 'electron';

import AnalyzerChannel from './AnalyzerChannel';
import Channel from './Channel';
import FetchSoundsChannel from './FetchSoundsChannel';
import CountSoundsChannel from './CountSoundsChannel';
import ClearSoundsChannel from './ClearSoundsChannel';
import InsertSoundChannel from './InsertSoundChannel';

const channels: Channel[] = [
    new AnalyzerChannel('analyze_sounds'),
    new FetchSoundsChannel('fetch_sounds'),
    new CountSoundsChannel('count_sounds'),
    new ClearSoundsChannel('clear_sounds'),
    new InsertSoundChannel('insert_sound'),
];

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
