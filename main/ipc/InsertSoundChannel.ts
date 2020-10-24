import { IpcMainEvent } from 'electron';

import { IpcRequest, IpcResponse } from '../../@types';
import db from '../db';

import Channel from './Channel';

export default class InsertSoundChannel extends Channel {
    /**
     * Receives sound analysis data and inserts into the DB
     * @param event
     * @param request
     */
    async handler(event: IpcMainEvent, request: IpcRequest) {
        const responseChannel = this.getResponseChannel();
        const data = request.params?.[0];
        if (!data) {
            // TODO: error message
            return;
        }

        let reply: IpcResponse = {};

        try {
            await db.sounds.insert(data);
        } catch (error) {
            reply = { error };
        }

        event.sender.send(responseChannel, reply);
    }
}
