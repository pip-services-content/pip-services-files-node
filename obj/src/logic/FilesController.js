"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const FilesCommandSet_1 = require("./FilesCommandSet");
class FilesController {
    constructor() {
        this._dependencyResolver = new pip_services_commons_node_2.DependencyResolver(FilesController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._blobsClient = this._dependencyResolver.getOneOptional('blobs');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new FilesCommandSet_1.FilesCommandSet(this);
        return this._commandSet;
    }
    getFilesByFilter(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getFilesByIds(correlationId, fileIds, callback) {
        this._persistence.getListByIds(correlationId, fileIds, callback);
    }
    getFileById(correlationId, fileId, callback) {
        this._persistence.getOneById(correlationId, fileId, callback);
    }
    normalizeName(name) {
        if (name == null)
            return null;
        name = name.replace('\\', '/');
        let pos = name.lastIndexOf('/');
        if (pos >= 0)
            name = name.substring(pos + 1);
        return name;
    }
    createFile(correlationId, file, callback) {
        file.id = file.id || pip_services_commons_node_3.IdGenerator.nextLong();
        file.name = this.normalizeName(file.name);
        file.create_time = new Date();
        this._persistence.create(correlationId, file, callback);
    }
    updateFile(correlationId, file, callback) {
        file.name = this.normalizeName(file.name);
        this._persistence.update(correlationId, file, callback);
    }
    deleteFileById(correlationId, fileId, callback) {
        let file;
        async.series([
            (callback) => {
                this._persistence.deleteById(correlationId, fileId, (err, data) => {
                    file = data;
                    callback(err);
                });
            },
            (callback) => {
                if (file != null && file.content_id != null && this._blobsClient != null)
                    this._blobsClient.deleteBlobById(correlationId, file.content_id, callback);
                else
                    callback();
            },
            (callback) => {
                if (file != null && file.thumbnail_id != null && this._blobsClient != null)
                    this._blobsClient.deleteBlobById(correlationId, file.thumbnail_id, callback);
                else
                    callback();
            }
        ], (err) => {
            callback(err, file);
        });
    }
}
FilesController._defaultConfig = pip_services_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-files:persistence:*:*:1.0', 'dependencies.blobs', 'pip-services-blobs:client:*:*:1.0');
exports.FilesController = FilesController;
//# sourceMappingURL=FilesController.js.map