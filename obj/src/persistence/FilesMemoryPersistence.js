"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
class FilesMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    getGroups(correlationId, paging, callback) {
        let items = _.map(this._items, (item) => item.group);
        items = _.uniq(items);
        // Extract a page
        paging = paging != null ? paging : new pip_services3_commons_node_2.PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);
        let total = null;
        if (paging.total)
            total = items.length;
        if (skip > 0)
            items = _.slice(items, skip);
        items = _.take(items, take);
        let page = new pip_services3_commons_node_3.DataPage(items, total);
        callback(null, page);
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    matchSearch(item, search) {
        search = search.toLowerCase();
        if (this.matchString(item.name, search))
            return true;
        if (this.matchString(item.description, search))
            return true;
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let name = filter.getAsNullableString('name');
        let group = filter.getAsNullableString('group');
        let expired = filter.getAsNullableBoolean('expired');
        let fromCreateTime = filter.getAsNullableDateTime('from_create_time');
        let toCreateTime = filter.getAsNullableDateTime('to_create_time');
        let now = new Date();
        return (item) => {
            if (search != null && !this.matchSearch(item, search))
                return false;
            if (id != null && id != item.id)
                return false;
            if (name != null && name != item.name)
                return false;
            if (group != null && group != item.group)
                return false;
            if (expired != null && expired == true && item.expire_time > now)
                return false;
            if (expired != null && expired == false && item.expire_time <= now)
                return false;
            if (fromCreateTime != null && item.create_time >= fromCreateTime)
                return false;
            if (toCreateTime != null && item.create_time < toCreateTime)
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
}
exports.FilesMemoryPersistence = FilesMemoryPersistence;
//# sourceMappingURL=FilesMemoryPersistence.js.map