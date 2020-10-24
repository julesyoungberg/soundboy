import { IpcMainEvent } from 'electron';

import { IpcRequest, IpcResponse } from '../../@types';
import Analyzer from '../Analyzer';

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

        const folder = request.params?.[0];
        if (!folder) {
            // TODO: error message
            return;
        }

        const sendUpdate = (data: IpcResponse) => {
            console.log('sending update to', responseChannel);
            event.sender.send(responseChannel, data);
        };

        this.analyzer.analyze(folder, sendUpdate);
    }
}
