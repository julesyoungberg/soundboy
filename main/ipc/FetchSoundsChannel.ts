import { IpcMainEvent } from 'electron';

import { IpcRequest, IpcResponse } from '../../@types';
import db from '../db';

import Channel from './Channel';

export default class FetchSoundsChannel extends Channel {
    /**
     * Fetches sounds from the DB given a query
     * @param event
     * @param request { responseChannel, params: [DB query object] }
     */
    async handler(event: IpcMainEvent, request: IpcRequest) {
        console.log('FetchSoundsChannel request: ', request.params);
        const responseChannel = this.getResponseChannel();
        const query = request.params?.[0];
        if (!query) {
            // TODO: error message
            return;
        }

        let reply: IpcResponse = {};

        try {
            const results = await db.sounds.fetch(query);
            reply = { results };
        } catch (error) {
            reply = { error };
        }

        event.sender.send(responseChannel, reply);
    }
}
