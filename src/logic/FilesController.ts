let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { DependencyResolver } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { ICommandable } from 'pip-services-commons-node';
import { CommandSet } from 'pip-services-commons-node';
import { IdGenerator } from 'pip-services-commons-node';

import { IBlobsClientV1 } from 'pip-clients-blobs-node';
import { IFacetsClientV1 } from 'pip-clients-facets-node';

import { FileV1 } from '../data/version1/FileV1';
import { IFilesPersistence } from '../persistence/IFilesPersistence';
import { IFilesController} from './IFilesController';
import { FilesCommandSet } from './FilesCommandSet';

export class FilesController implements IConfigurable, IReferenceable, ICommandable, IFilesController{
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-files:persistence:*:*:1.0',
        'dependencies.blobs', 'pip-services-blobs:client:*:*:1.0',
        'dependencies.facets', 'pip-clients-facets:client:*:*:1.0',

        'options.facets_group', 'files'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(FilesController._defaultConfig);
    private _persistence: IFilesPersistence;
    private _blobsClient: IBlobsClientV1;
    private _facetsClient: IFacetsClientV1;
    private _commandSet: FilesCommandSet;
    private _facetsGroup: string = 'files';

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
        this._facetsGroup = config.getAsStringWithDefault('options.facets_group', this._facetsGroup);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IFilesPersistence>('persistence');
        this._blobsClient = this._dependencyResolver.getOneOptional<IBlobsClientV1>('blobs');
        this._facetsClient = this._dependencyResolver.getOneOptional<IFacetsClientV1>('facets');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new FilesCommandSet(this);
        return this._commandSet;
    }

    public getGroups(correlationId: string, paging: PagingParams,
        callback: (err: any, page: DataPage<string>) => void): void {
        // When facets client is defined then use it to retrieve groups
        if (this._facetsClient != null) {
            this._facetsClient.getFacetsByGroup(correlationId, this._facetsGroup, paging, (err, page) => {
                if (page != null) {
                    let data = _.map(page.data, (facet) => facet.group);
                    let result = new DataPage<string>(data, page.total);
                    callback(err, result);
                } else {
                    callback(err, null);
                }
            });
        } 
        // Otherwise retrieve groups directly. But that is going to be VERY slow. Don't use it in production!
        else {
            this._persistence.getGroups(correlationId, paging, callback);
        }
    }

    public getFilesByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<FileV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getFilesByIds(correlationId: string, fileIds: string[],
        callback: (err: any, files: FileV1[]) => void): void {
        this._persistence.getListByIds(correlationId, fileIds, callback);
    }

    public getFileById(correlationId: string, fileId: string,
        callback: (err: any, file: FileV1) => void): void {
        this._persistence.getOneById(correlationId, fileId, callback);
    }

    private normalizeName(name: string): string {
        if (name == null) return null;

        name = name.replace('\\', '/');
        let pos = name.lastIndexOf('/');
        if (pos >= 0)
            name = name.substring(pos + 1);

        return name;
    }

    public createFile(correlationId: string, file: FileV1,
        callback: (err: any, file: FileV1) => void): void {
        let newFile: FileV1;

        file.id = file.id || IdGenerator.nextLong();
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
                else callback();
            }
        ], (err) => {
            callback(err, err == null ? newFile : null);
        });
    }

    public updateFile(correlationId: string, file: FileV1,
        callback: (err: any, file: FileV1) => void): void {
        let newFile: FileV1;

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
                else callback();
            },
            // Add new group from facet search
            (callback) => {
                if (this._facetsClient != null && newFile.group != null && file.group != newFile.group)
                    this._facetsClient.addFacet(correlationId, this._facetsGroup, newFile.group, callback);
                else callback();
            }
        ], (err) => {
            callback(err, err == null ? newFile : null);
        });
    }

    public deleteFileById(correlationId: string, fileId: string,
        callback?: (err: any, file: FileV1) => void): void {
        let file: FileV1;
        
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
                else callback();
            },
            // Delete thumbnail blob
            (callback) => {
                if (file != null && file.thumbnail_id != null && this._blobsClient != null)
                    this._blobsClient.deleteBlobById(correlationId, file.thumbnail_id, callback);
                else callback();
            },
            // Remove group from facet search
            (callback) => {
                if (this._facetsClient != null && file.group != null)
                    this._facetsClient.removeFacet(correlationId, this._facetsGroup, file.group, callback);
                else callback();
            }
        ], (err) => {
            callback(err, file);
        });
    }
}
