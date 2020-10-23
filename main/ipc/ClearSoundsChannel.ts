import { IpcMainEvent } from 'electron';

import { IPCRequest, IPCResponse } from '../../@types';
import db from '../db';

import Channel from './Channel';

export default class ClearSoundsChannel extends Channel {
    /**
     * Clears all sounds from the DB
     * @param event
     * @param request { responseChannel, params: [DB query object] }
     */
    async handler(event: IpcMainEvent, request: IPCRequest) {
        console.log('ClearSoundsChannel request: ', request.params);
        const responseChannel = this.getResponseChannel(request);
        const reply: IPCResponse = {};
        await db.sounds.clear();
        event.sender.send(responseChannel, JSON.stringify(reply));
    }
}
