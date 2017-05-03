"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const FilesCommandSet_1 = require("./FilesCommandSet");
class FilesController {
    constructor() {
        this._dependencyResolver = new pip_services_commons_node_2.DependencyResolver(FilesController._defaultConfig);
        this._facetsGroup = 'files';
    }
    configure(config) {
        this._dependencyResolver.configure(config);
        this._facetsGroup = config.getAsStringWithDefault('options.facets_group', this._facetsGroup);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._blobsClient = this._dependencyResolver.getOneOptional('blobs');
        this._facetsClient = this._dependencyResolver.getOneOptional('facets');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new FilesCommandSet_1.FilesCommandSet(this);
        return this._commandSet;
    }
    getGroups(correlationId, paging, callback) {
        // When facets client is defined then use it to retrieve groups
        if (this._facetsClient != null) {
            this._facetsClient.getFacetsByGroup(correlationId, this._facetsGroup, paging, (err, page) => {
                if (page != null) {
                    let data = _.map(page.data, (facet) => facet.group);
                    let result = new pip_services_commons_node_3.DataPage(data, page.total);
                    callback(err, result);
                }
                else {
                    callback(err, null);
                }
            });
        }
        else {
            this._persistence.getGroups(correlationId, paging, callback);
        }
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
        let newFile;
        file.id = file.id || pip_services_commons_node_4.IdGenerator.nextLong();
        file.name = this.normalizeName(file.name);
        file.create_time = new Date();
        async.series([
            // Create file
            (callback) => {
                this._persistence.create(correlationId, file, (err, data) => {
                    newFile = data;
                    callback(err);
                });
            },
            // Add group to facet search
            (callback) => {
                if (this._facetsClient != null && file.group != null)
                    this._facetsClient.addFacet(correlationId, this._facetsGroup, file.group, callback);
                else
                    callback();
            }
        ], (err) => {
            callback(err, err == null ? newFile : null);
        });
    }
    updateFile(correlationId, file, callback) {
        let newFile;
        file.name = this.normalizeName(file.name);
        async.series([
            // Update file
            (callback) => {
                this._persistence.update(correlationId, file, (err, data) => {
                    newFile = data;
                    callback(err);
                });
            },
            // Remove old group from facet search
            (callback) => {
                if (this._facetsClient != null && file.group != null && file.group != newFile.group)
                    this._facetsClient.removeFacet(correlationId, this._facetsGroup, file.group, callback);
                else
                    callback();
            },
            // Add new group from facet search
            (callback) => {
                if (this._facetsClient != null && newFile.group != null && file.group != newFile.group)
                    this._facetsClient.addFacet(correlationId, this._facetsGroup, newFile.group, callback);
                else
                    callback();
            }
        ], (err) => {
            callback(err, err == null ? newFile : null);
        });
    }
    deleteFileById(correlationId, fileId, callback) {
        let file;
        async.series([
            // Delete file
            (callback) => {
                this._persistence.deleteById(correlationId, fileId, (err, data) => {
                    file = data;
                    callback(err);
                });
            },
            // Delete content blob
            (callback) => {
                if (file != null && file.content_id != null && this._blobsClient != null)
                    this._blobsClient.deleteBlobById(correlationId, file.content_id, callback);
                else
                    callback();
            },
            // Delete thumbnail blob
            (callback) => {
                if (file != null && file.thumbnail_id != null && this._blobsClient != null)
                    this._blobsClient.deleteBlobById(correlationId, file.thumbnail_id, callback);
                else
                    callback();
            },
            // Remove group from facet search
            (callback) => {
                if (this._facetsClient != null && file.group != null)
                    this._facetsClient.removeFacet(correlationId, this._facetsGroup, file.group, callback);
                else
                    callback();
            }
        ], (err) => {
            callback(err, file);
        });
    }
}
FilesController._defaultConfig = pip_services_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-files:persistence:*:*:1.0', 'dependencies.blobs', 'pip-services-blobs:client:*:*:1.0', 'dependencies.facets', 'pip-clients-facets:client:*:*:1.0', 'options.facets_group', 'files');
exports.FilesController = FilesController;
//# sourceMappingURL=FilesController.js.map