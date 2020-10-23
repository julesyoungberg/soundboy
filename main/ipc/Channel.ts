import { IpcMainEvent } from 'electron';

import { IPCRequest } from '../../@types';

export default abstract class Channel {
    constructor(readonly name: string) {}

    getResponseChannel(request: IPCRequest) {
        return request.responseChannel || `${this.name}_response`;
    }

    abstract async handler(event: IpcMainEvent, request: IPCRequest): Promise<void>;
}
