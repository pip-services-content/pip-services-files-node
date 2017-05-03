import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services-data-node';
import { FileV1 } from '../data/version1/FileV1';
import { IFilesPersistence } from './IFilesPersistence';
export declare class FilesMemoryPersistence extends IdentifiableMemoryPersistence<FileV1, string> implements IFilesPersistence {
    constructor();
    getGroups(correlationId: string, paging: PagingParams, callback: (err: any, page: DataPage<string>) => void): void;
    private matchString(value, search);
    private matchSearch(item, search);
    private composeFilter(filter);
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<FileV1>) => void): void;
}
