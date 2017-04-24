let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';

import { FileV1 } from '../../src/data/version1/FileV1';
import { IFilesPersistence } from '../../src/persistence/IFilesPersistence';

let FILE1 = new FileV1(null, 'test', 'files_image1.jpg', null, '111');
let FILE2 = new FileV1(null, 'test', 'files_image2.jpg', null, '222');

export class FilesPersistenceFixture {
    private _persistence: IFilesPersistence;
    
    constructor(persistence: IFilesPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    testCrudOperations(done) {
        let file1, file2;

        async.series([
        // Upload one file
            (callback) => {
                this._persistence.create(
                    null,
                    FILE1,
                    (err, file) => {
                        assert.isNull(err);
                        
                        assert.isObject(file);
                        file1 = file;

                        assert.equal(file.name, FILE1.name);
                        assert.equal(file.group, FILE1.group);
                        assert.equal(file.content_id, FILE1.content_id);

                        callback();
                    }
                );
            },
        // Upload another file
            (callback) => {
                this._persistence.create(
                    null,
                    FILE2,
                    (err, file) => {
                        assert.isNull(err);
                        
                        assert.isObject(file);
                        file2 = file;

                        assert.equal(file.name, FILE2.name);
                        assert.equal(file.group, FILE2.group);
                        assert.equal(file.content_id, FILE2.content_id);

                        callback();
                    }
                );
            },
        // Get all files
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        group: 'test'
                    }),
                    new PagingParams(),
                    (err, files) => {
                        assert.isNull(err);
                        
                        assert.isObject(files);
                        assert.lengthOf(files.data, 2);

                        callback();
                    }
                );
            },
        // Get the file
            (callback) => {
                this._persistence.getOneById(
                    null,
                    file1.id,
                    (err, file) => {
                        assert.isNull(err);
                        
                        assert.isObject(file);
                        assert.equal(file.id, file1.id);

                        callback();
                    }
                );
            },
        // Update the file
            (callback) => {
                file1.name = "file1.xxx";

                this._persistence.update(
                    null,
                    file1,
                    (err, file) => {
                        assert.isNull(err);
                        
                        assert.isObject(file);
                        file1 = file;

                        assert.equal(file.id, file1.id);
                        assert.equal(file.name, 'file1.xxx');

                        callback();
                    }
                );
            },
        // Delete the file
            (callback) => {
                this._persistence.deleteById(
                    null,
                    file1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Delete all files
            (callback) => {
                this._persistence.deleteById(
                    null,
                    file1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get deleted file
            (callback) => {
                this._persistence.getOneById(
                    null,
                    file1.id,
                    (err, file) => {
                        assert.isNull(err);

                        assert.isNull(file || null);

                        callback();
                    }
                );
            }
        ], done);
    }

}
