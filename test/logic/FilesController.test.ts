let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-components-node';
import { IdGenerator } from 'pip-services-commons-node';

import { FileV1 } from '../../src/data/version1/FileV1';
import { FilesMemoryPersistence } from '../../src/persistence/FilesMemoryPersistence';
import { FilesController } from '../../src/logic/FilesController';

suite('FilesController', ()=> {
    let persistence: FilesMemoryPersistence;
    let controller: FilesController;

    suiteSetup((done) => {
        persistence = new FilesMemoryPersistence();
        controller = new FilesController();

        let logger = new ConsoleLogger();

        let references: References = References.fromTuples(
            new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-files', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-files', 'controller', 'default', 'default', '1.0'), controller,
        );
        controller.setReferences(references);

        done();
    });
        
    setup((done) => {
        persistence.clear(null, done);
    });
    
    test('CRUD Operations', (done) => {
        let file1: FileV1;

        async.series([
        // Create file
            (callback) => {
                let file = new FileV1(
                    null, 'test', 'file-1.dat', 'Test file', '1'
                );

                controller.createFile(
                    null, file,
                    (err, file) => {
                        assert.isNull(err);
                        
                        assert.isObject(file);
                        file1 = file;

                        callback();
                    }
                );
            },
        // Update file
            (callback) => {
                file1.name = 'new_name.dat';

                controller.updateFile(
                    null, file1,
                    (err, file) => {
                        assert.isNull(err);

                        assert.equal(file.name, 'new_name.dat');

                        callback();
                    }
                );
            },
        // Get files
            (callback) => {
                controller.getFilesByFilter(
                    null, null, null, 
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
        // Get groups
            (callback) => {
                controller.getGroups(
                    null, null, 
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
        // Delete file
            (callback) => {
                controller.deleteFileById(
                    null, file1.id,
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Try to get deleted file
            (callback) => {
                controller.getFileById(
                    null, file1.id, (err, file) => {
                        assert.isNull(err);
                        assert.isNull(file);
                        callback();
                    }
                )
            }
        ], done);
    });
});