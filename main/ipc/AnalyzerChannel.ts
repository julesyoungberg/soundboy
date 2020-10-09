import { IpcMainEvent } from 'electron';

// import { analyzeSounds } from '../analyzer';
import Channel from './Channel';

export default class AnalyzerChannel extends Channel {
    /**
     * Analyzes a list of sound files and stores the results in the database.
     * Progress is streamed to the client with each db entry.
     * @param event
     * @param request { responseChannel, params: a list of sound file names }
     */
    async handler(event: IpcMainEvent, request: IPCRequest) {
        console.log('AnalyzerChannel request: ', request.params);
        const responseChannel = this.getResponseChannel(request);

        const sendUpdate = (data: IPCResponse) => {
            event.sender.send(responseChannel, [JSON.stringify(data)]);
        };

        const folder = request.params?.[0];
        if (!folder) {
            sendUpdate({ done: true, error: 'No folder specified' });
            return;
        }

        // await analyzeSounds(folder, sendUpdate);
    }
}
