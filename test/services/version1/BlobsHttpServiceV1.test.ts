let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';

import { FileV1 } from '../../../src/data/version1/FileV1';
import { FilesMemoryPersistence } from '../../../src/persistence/FilesMemoryPersistence';
import { FilesController } from '../../../src/logic/FilesController';
import { FilesHttpServiceV1 } from '../../../src/services/version1/FilesHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);


suite('FilesHttpServiceV1', ()=> {
    let service: FilesHttpServiceV1;
    let persistence: FilesMemoryPersistence;
    let rest: any;

    suiteSetup((done) => {
        persistence = new FilesMemoryPersistence();
        let controller = new FilesController();

        service = new FilesHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-files', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-files', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-files', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup((done) => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });

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

                rest.post('/v1/files/create_file',
                    {
                        file: file
                    },
                    (err, req, res, file) => {
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

                rest.post('/v1/files/update_file',
                    {
                        file: file1
                    },
                    (err, req, res, file) => {
                        assert.isNull(err);
                        
                        assert.isObject(file);
                        assert.equal(file.name, 'new_file.dat');

                        callback();
                    }
                );
            },
        // Get files
            (callback) => {
                rest.post('/v1/files/get_files_by_filter',
                    {
                    },
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
        // Delete file
            (callback) => {
                rest.post('/v1/files/delete_file_by_id',
                    {
                        file_id: file1.id
                    },
                    (err, req, res) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Try to get deleted file
            (callback) => {
                rest.post('/v1/files/get_file_by_id',
                    {
                        file_id: file1.id
                    },
                    (err, req, res, file) => {
                        assert.isNull(err);
                        //assert.isNull(file);
                        callback();
                    }
                )
            }
        ], done);
    });
});