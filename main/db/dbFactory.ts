import Datastore from 'nedb-promises';

export default (fileName: string) =>
    Datastore.create({
        filename: `./.data/${fileName}`,
        timestampData: true,
        autoload: true,
    });
