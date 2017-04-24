import { ConfigParams } from 'pip-services-commons-node';

import { FilesFilePersistence } from '../../src/persistence/FilesFilePersistence';
import { FilesPersistenceFixture } from './FilesPersistenceFixture';

suite('FilesFilePersistence', ()=> {
    let persistence: FilesFilePersistence;
    let fixture: FilesPersistenceFixture;
    
    setup((done) => {
        persistence = new FilesFilePersistence('./data/files.test.json');

        fixture = new FilesPersistenceFixture(persistence);
        
        persistence.open(null, (err) => {
            if (err) done(err);
            else persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});