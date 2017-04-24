let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-commons-node';
import { IdGenerator } from 'pip-services-commons-node';

import { FileV1 } from '../../src/data/version1/FileV1';
import { FilesController } from '../../src/logic/FilesController';
import { FilesLambdaFunction } from '../../src/container/FilesLambdaFunction';

suite('FilesLambdaFunction', ()=> {
    let lambda: FilesLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services-commons:logger:console:default:1.0',
            'persistence.descriptor', 'pip-services-files:persistence:memory:default:1.0',
            'controller.descriptor', 'pip-services-files:controller:default:default:1.0'
        );

        lambda = new FilesLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        let file1: FileV1;

        async.series([
        // Start writing file
            (callback) => {
                let file = new FileV1(
                    null, 'test', 'file-1.dat',  'Test file', '111'
                );

                lambda.act(
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
            (callback) => {
                file1.name = 'new_file.dat';

                lambda.act(
                    {
                        role: 'files',
                        cmd: 'update_file',
                        file: file1
                    },
                    (err, file) => {
                        assert.isNull(err);
                        
                        assert.equal(file1.name, 'new_file.dat');

                        callback();
                    }
                );
            },
        // Get files
            (callback) => {
                lambda.act(
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
                lambda.act(
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
                lambda.act(
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