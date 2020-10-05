import { IpcMainEvent } from 'electron';

import { analyzeSounds } from '../analyzer';
import Channel from './Channel';

export default class AnalyzerChannel extends Channel {
    /**
     * Analyzes a list of sound files and stores the results in the database.
     * Progress is streamed to the client with each db entry.
     * @param event
     * @param request { responseChannel, params: a list of sound file names }
     */
    async handler(event: IpcMainEvent, request: IPC.Request) {
        console.log('AnalyzerChannel request: ', request.params);
        const responseChannel = this.getResponseChannel(request);

        const folder = request.params?.[0]
        if (!folder) {
            // TODO: error message
            return;
        }

        const sendUpdate = (data: Record<string, any>) => {
            event.sender.send(responseChannel, data);
        };

        await analyzeSounds(folder, sendUpdate);
    }
}
