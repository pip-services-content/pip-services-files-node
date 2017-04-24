import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { IGetter } from 'pip-services-data-node';
import { IWriter } from 'pip-services-data-node';
import { FileV1 } from '../data/version1/FileV1';
export interface IFilesPersistence extends IGetter<FileV1, string>, IWriter<FileV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<FileV1>) => void): void;
    getListByIds(correlationId: string, ids: string[], callback: (err: any, items: FileV1[]) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: FileV1) => void): void;
    create(correlationId: string, item: FileV1, callback: (err: any, item: FileV1) => void): void;
    update(correlationId: string, item: FileV1, callback: (err: any, item: FileV1) => void): void;
    deleteById(correlationId: string, id: string, callback?: (err: any, item: FileV1) => void): void;
}
