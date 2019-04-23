let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { AnyValueMap } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { FileV1 } from '../data/version1/FileV1';
import { IFilesPersistence } from './IFilesPersistence';
import { FilesMongoDbSchema } from './FilesMongoDbSchema';

export class FilesMongoDbPersistence 
    extends IdentifiableMongoDbPersistence<FileV1, string> 
    implements IFilesPersistence {

    constructor() {
        super('files', FilesMongoDbSchema());
    }

    public getGroups(correlationId: string, paging: PagingParams,
        callback: (err: any, page: DataPage<string>) => void): void {
        
        // Extract a page
        paging = paging != null ? paging : new PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);

        let filter = { };
        let options = { group: 1 };
        
        this._model.find(filter, options, (err, items) => {
            if (items != null) {
                items = _.map(items, (item) => item.group);
                items = _.uniq(items);
            
                let total = null;
                if (paging.total)
                    total = items.length;
                
                if (skip > 0)
                    items = _.slice(items, skip);
                items = _.take(items, take);
                        
                let page = new DataPage<string>(items, total);
                callback(null, page);
            } else {
                callback(err, null);
            }
        });
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let criteria = [];

        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            searchCriteria.push({ name: { $regex: searchRegex } });
            searchCriteria.push({ description: { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let name = filter.getAsNullableString('name');
        if (name != null)
            criteria.push({ name: name });

        let group = filter.getAsNullableString('group');
        if (group != null)
            criteria.push({ group: group });

        let type = filter.getAsNullableString('type');
        if (type != null)
            criteria.push({ type: type });

        let expired = filter.getAsNullableBoolean('expired');
        if (expired != null) {
            let now = new Date();
            if (expired)
                criteria.push({ expire_time: { $lte: now } });
            else
                criteria.push({ expire_time: { $gt: now } });
        }

        let fromCreateTime = filter.getAsNullableDateTime('from_create_time');
        if (fromCreateTime != null)
            criteria.push({ create_time: { $gte: fromCreateTime } });

        let toCreateTime = filter.getAsNullableDateTime('to_create_time');
        if (toCreateTime != null)
            criteria.push({ create_time: { $lt: toCreateTime } });

        return criteria.length > 0 ? { $and: criteria } : {};
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: any) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, '-create_time', { custom_dat: 0 }, callback);
    }

}
