import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { ICommandable } from 'pip-services-commons-node';
import { CommandSet } from 'pip-services-commons-node';
import { FileV1 } from '../data/version1/FileV1';
import { IFilesController } from './IFilesController';
export declare class FilesController implements IConfigurable, IReferenceable, ICommandable, IFilesController {
    private static _defaultConfig;
    private _dependencyResolver;
    private _persistence;
    private _blobsClient;
    private _commandSet;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getCommandSet(): CommandSet;
    getFilesByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<FileV1>) => void): void;
    getFilesByIds(correlationId: string, fileIds: string[], callback: (err: any, files: FileV1[]) => void): void;
    getFileById(correlationId: string, fileId: string, callback: (err: any, file: FileV1) => void): void;
    private normalizeName(name);
    createFile(correlationId: string, file: FileV1, callback: (err: any, file: FileV1) => void): void;
    updateFile(correlationId: string, file: FileV1, callback: (err: any, file: FileV1) => void): void;
    deleteFileById(correlationId: string, fileId: string, callback?: (err: any, file: FileV1) => void): void;
}
