import Datastore from 'nedb-promises';

import { Sound } from '../../@types';

import dbFactory from './dbFactory';

class Sounds {
    private db: Datastore;

    constructor() {
        this.db = dbFactory('sounds.db');
    }

    // TODO validation - ajx? - make sure no duplicates
    async insert(data: Record<string, any>) {
        console.log('sounds db insert: ', data);
        const result = await this.db.insert(data);
        return result;
    }

    async fetch(query: Record<string, any>): Promise<Sound[]> {
        console.log('sounds db fetch: ', query);
        const result = await this.db.find(query);
        return result as any;
    }

    async clear() {
        // await this.db.remove({}, { multi: true }, (err, numRemoved) => {
        //     this.db.loadDatabase((err) => {
        //         if (err) console.log(err);
        //     });
        // });
        await this.db.remove({}, { multi: true });
    }
}

const sounds = new Sounds();

export default sounds;
