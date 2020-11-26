import { IpcMainEvent } from 'electron';

import { IpcRequest } from '../../@types';

export default abstract class Channel {
    constructor(readonly name: string) {}

    getResponseChannel() {
        return `${this.name}_response`;
    }

    abstract handler(event: IpcMainEvent, request: IpcRequest): Promise<void>;
}
