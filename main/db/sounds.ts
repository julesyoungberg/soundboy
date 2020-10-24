import Datastore from 'nedb-promises';

import { Sound } from '../../@types';

import dbFactory from './dbFactory';

/**
 * Sounds Database Interface
 */
class Sounds {
    private db: Datastore;

    constructor() {
        this.db = dbFactory('sounds.db');
        this.db.ensureIndex({ fieldName: 'filename', unique: true });
    }

    async insert(data: Sound) {
        try {
            const result = await this.db.insert(data);
            return result;
        } catch (error) {
            // it failed, try to update incase it exists
            const result = await this.update(data);
            return result;
        }
    }

    async update(data: Sound) {
        await this.db.update({ filename: data.filename }, data);
    }

    async fetch(query: Record<string, any>): Promise<Sound[]> {
        const result = await this.db.find(query);
        return result as any;
    }

    async clear() {
        await this.db.remove({}, { multi: true });
    }
}

const sounds = new Sounds();

export default sounds;
