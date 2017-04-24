"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_data_node_1 = require("pip-services-data-node");
const FilesMongoDbSchema_1 = require("./FilesMongoDbSchema");
class FilesMongoDbPersistence extends pip_services_data_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('files', FilesMongoDbSchema_1.FilesMongoDbSchema());
    }
    composeFilter(filter) {
        filter = filter || new pip_services_commons_node_1.FilterParams();
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
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, '-create_time', { custom_dat: 0 }, callback);
    }
}
exports.FilesMongoDbPersistence = FilesMongoDbPersistence;
//# sourceMappingURL=FilesMongoDbPersistence.js.map