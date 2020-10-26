import { IpcMainEvent } from 'electron';

import { IpcRequest, IpcResponse } from '../../@types';
import Analyzer from '../analyzer';

import Channel from './Channel';

export default class AnalyzerChannel extends Channel {
    analyzer: Analyzer | undefined;

    constructor(readonly name: string) {
        super(name);
        this.analyzer = new Analyzer();
    }

    /**
     * Analyzes a list of sound files and stores the results in the database.
     * Progress is streamed to the client with each db entry.
     * @param event
     * @param request { responseChannel, params: a list of sound file names }
     */
    async handler(event: IpcMainEvent, request: IpcRequest) {
        console.log('AnalyzerChannel request: ', request.params);
        const responseChannel = this.getResponseChannel();

        const sendUpdate = (data: IpcResponse) => {
            event.sender.send(responseChannel, data);
        };

        const folder = request.params?.[0];
        if (!folder) {
            sendUpdate({ error: 'No folder specified' });
            return;
        }

        this.analyzer.analyze(folder, sendUpdate);
    }
}
