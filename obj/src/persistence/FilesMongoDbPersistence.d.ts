import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services-data-node';
import { FileV1 } from '../data/version1/FileV1';
import { IFilesPersistence } from './IFilesPersistence';
export declare class FilesMongoDbPersistence extends IdentifiableMongoDbPersistence<FileV1, string> implements IFilesPersistence {
    constructor();
    private composeFilter(filter);
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: any): void;
}