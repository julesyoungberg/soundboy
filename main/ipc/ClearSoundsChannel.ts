import { IpcMainEvent } from 'electron';

import { IpcRequest, IpcResponse } from '../../@types';
import db from '../db';

import Channel from './Channel';

export default class ClearSoundsChannel extends Channel {
    /**
     * Clears all sounds from the DB
     * @param event
     * @param request { responseChannel, params: [DB query object] }
     */
    async handler(event: IpcMainEvent, request: IpcRequest) {
        console.log('ClearSoundsChannel request: ', request.params);
        const responseChannel = this.getResponseChannel();
        const reply: IpcResponse = {};
        await db.sounds.clear();
        event.sender.send(responseChannel, reply);
    }
}
