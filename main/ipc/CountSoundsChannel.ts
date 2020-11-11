import { IpcMainEvent } from 'electron';

import { IpcRequest, IpcResponse } from '../../@types';
import db from '../db';

import Channel from './Channel';

export default class CountSoundsChannel extends Channel {
    /**
     * Counts size of a results given a DB query
     * @param event
     * @param request { responseChannel, params: [DB query object] }
     */
    async handler(event: IpcMainEvent, request: IpcRequest) {
        console.log('CountSoundsChannel request: ', request.params);
        const responseChannel = this.getResponseChannel();
        const query = request.params?.[0];
        if (!query) {
            // TODO: error message
            return;
        }

        let reply: IpcResponse = {};

        try {
            const count = await db.sounds.count(query);
            reply = { count };
        } catch (error) {
            reply = { error };
        }

        event.sender.send(responseChannel, reply);
    }
}
