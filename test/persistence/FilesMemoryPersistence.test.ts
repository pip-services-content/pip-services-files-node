import { FilesMemoryPersistence } from '../../src/persistence/FilesMemoryPersistence';
import { FilesPersistenceFixture } from './FilesPersistenceFixture';

suite('FilesMemoryPersistence', ()=> {
    let persistence: FilesMemoryPersistence;
    let fixture: FilesPersistenceFixture;
    
    setup((done) => {
        persistence = new FilesMemoryPersistence();
        fixture = new FilesPersistenceFixture(persistence);
        
        persistence.open(null, done);
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

});