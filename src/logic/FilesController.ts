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

import { FileV1 } from '../data/version1/FileV1';
import { IFilesPersistence } from '../persistence/IFilesPersistence';
import { IFilesController} from './IFilesController';
import { FilesCommandSet } from './FilesCommandSet';

export class FilesController implements IConfigurable, IReferenceable, ICommandable, IFilesController{
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-files:persistence:*:*:1.0',
        'dependencies.blobs', 'pip-services-blobs:client:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(FilesController._defaultConfig);
    private _persistence: IFilesPersistence;
    private _blobsClient: IBlobsClientV1;
    private _commandSet: FilesCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IFilesPersistence>('persistence');
        this._blobsClient = this._dependencyResolver.getOneOptional<IBlobsClientV1>('blobs');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new FilesCommandSet(this);
        return this._commandSet;
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
        file.id = file.id || IdGenerator.nextLong();
        file.name = this.normalizeName(file.name);
        file.create_time = new Date();

        this._persistence.create(correlationId, file, callback);
    }

    public updateFile(correlationId: string, file: FileV1,
        callback: (err: any, file: FileV1) => void): void {
        file.name = this.normalizeName(file.name);

        this._persistence.update(correlationId, file, callback);
    }

    public deleteFileById(correlationId: string, fileId: string,
        callback?: (err: any, file: FileV1) => void): void {
        let file: FileV1;
        
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
                else callback();
            },
            (callback) => {
                if (file != null && file.thumbnail_id != null && this._blobsClient != null)
                    this._blobsClient.deleteBlobById(correlationId, file.thumbnail_id, callback);
                else callback();
            }
        ], (err) => {
            callback(err, file);
        });
    }
}
