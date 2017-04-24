import { YamlConfigReader } from 'pip-services-commons-node';

import { FilesMongoDbPersistence } from '../../src/persistence/FilesMongoDbPersistence';
import { FilesPersistenceFixture } from './FilesPersistenceFixture';

suite('FilesMongoDbPersistence', ()=> {
    let persistence: FilesMongoDbPersistence;
    let fixture: FilesPersistenceFixture;

    setup((done) => {
        let config = YamlConfigReader.readConfig(null, './config/test_connections.yaml', null);
        let dbConfig = config.getSection('mongodb');

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