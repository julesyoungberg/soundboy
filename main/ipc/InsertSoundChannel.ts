import { IpcMainEvent } from 'electron';

import { IPCRequest, IPCResponse } from '../../@types';
import db from '../db';

import Channel from './Channel';

export default class AnalyzerChannel extends Channel {
    /**
     * Receives sound analysis data and inserts into the DB
     * @param event
     * @param request
     */
    async handler(event: IpcMainEvent, request: IPCRequest) {
        const responseChannel = this.getResponseChannel(request);
        const data = request.params?.[0];
        if (!data) {
            // TODO: error message
            return;
        }

        let reply: IPCResponse = {};

        try {
            await db.sounds.insert(JSON.parse(data));
        } catch (error) {
            reply = { error };
        }

        event.sender.send(responseChannel, JSON.stringify(reply));
    }
}
