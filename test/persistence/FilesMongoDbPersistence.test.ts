let process = require('process');

import { ConfigParams } from 'pip-services3-commons-node';

import { FilesMongoDbPersistence } from '../../src/persistence/FilesMongoDbPersistence';
import { FilesPersistenceFixture } from './FilesPersistenceFixture';

suite('FilesMongoDbPersistence', ()=> {
    let persistence: FilesMongoDbPersistence;
    let fixture: FilesPersistenceFixture;

    setup((done) => {
        var MONGO_DB = process.env["MONGO_DB"] || "test";
        var MONGO_COLLECTION = process.env["MONGO_COLLECTION"] || "eventlog";
        var MONGO_SERVICE_HOST = process.env["MONGO_SERVICE_HOST"] || "localhost";
        var MONGO_SERVICE_PORT = process.env["MONGO_SERVICE_PORT"] || "27017";
        var MONGO_SERVICE_URI = process.env["MONGO_SERVICE_URI"];

        var dbConfig = ConfigParams.fromTuples(
            "collection", MONGO_COLLECTION,
            "connection.database", MONGO_DB,
            "connection.host", MONGO_SERVICE_HOST,
            "connection.port", MONGO_SERVICE_PORT,
            "connection.uri", MONGO_SERVICE_URI
        );

        persistence = new FilesMongoDbPersistence();
        persistence.configure(dbConfig);

        fixture = new FilesPersistenceFixture(persistence);

        persistence.open(null, (err: any) => {
            persistence.clear(null, (err) => {
                done(err);
            });
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});