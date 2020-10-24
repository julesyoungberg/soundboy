import { IpcMainEvent } from 'electron';

import { IpcRequest } from '../../@types';

export default abstract class Channel {
    constructor(readonly name: string) {}

    getResponseChannel(request: IpcRequest) {
        return request.responseChannel || `${this.name}_response`;
    }

    abstract async handler(event: IpcMainEvent, request: IpcRequest): Promise<void>;
}
