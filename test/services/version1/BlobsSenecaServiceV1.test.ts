let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-commons-node';
import { SenecaInstance } from 'pip-services-net-node';
import { IdGenerator } from 'pip-services-commons-node';

import { FileV1 } from '../../../src/data/version1/FileV1';
import { FilesMemoryPersistence } from '../../../src/persistence/FilesMemoryPersistence';
import { FilesController } from '../../../src/logic/FilesController';
import { FilesSenecaServiceV1 } from '../../../src/services/version1/FilesSenecaServiceV1';


suite('FilesSenecaServiceV1', ()=> {
    let seneca: any;
    let service: FilesSenecaServiceV1;
    let persistence: FilesMemoryPersistence;
    let controller: FilesController;

    suiteSetup((done) => {
        persistence = new FilesMemoryPersistence();
        controller = new FilesController();

        service = new FilesSenecaServiceV1();
        service.configure(ConfigParams.fromTuples(
            "connection.protocol", "none"
        ));

        let logger = new ConsoleLogger();
        let senecaAddon = new SenecaInstance();

        let references: References = References.fromTuples(
            new Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-net', 'seneca', 'instance', 'default', '1.0'), senecaAddon,
            new Descriptor('pip-services-files', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-files', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-files', 'service', 'seneca', 'default', '1.0'), service
        );

        controller.setReferences(references);
        service.setReferences(references);

        seneca = senecaAddon.getInstance();

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
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
                    null, 'test', 'file-1.dat',  'Test file', '111'
                );

                seneca.act(
                    {
                        role: 'files',
                        cmd: 'create_file',
                        file: file
                    },
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
                file1.name = 'new_file.dat';

                seneca.act(
                    {
                        role: 'files',
                        cmd: 'update_file',
                        file: file1
                    },
                    (err, file) => {
                        assert.isNull(err);
                       
                        assert.isObject(file);
                        assert.equal(file.name, 'new_file.dat');

                        callback();
                    }
                );
            },
        // Get files
            (callback) => {
                seneca.act(
                    {
                        role: 'files',
                        cmd: 'get_files_by_filter'
                    },
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
        // Delete file
            (callback) => {
                seneca.act(
                    {
                        role: 'files',
                        cmd: 'delete_file_by_id',
                        file_id: file1.id
                    },
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Try to get deleted file
            (callback) => {
                seneca.act(
                    {
                        role: 'files',
                        cmd: 'get_file_by_id',
                        file_id: file1.id
                    },
                    (err, file) => {
                        assert.isNull(err);
                        assert.isNull(file);
                        callback();
                    }
                )
            }
        ], done);
    });
});