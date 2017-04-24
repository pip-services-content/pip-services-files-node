"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
class FileV1Schema extends pip_services_commons_node_1.ObjectSchema {
    constructor() {
        super();
        /* Identification */
        this.withOptionalProperty('id', pip_services_commons_node_2.TypeCode.String);
        this.withOptionalProperty('group', pip_services_commons_node_2.TypeCode.String);
        this.withRequiredProperty('name', pip_services_commons_node_2.TypeCode.String);
        /* Content */
        this.withOptionalProperty('description', pip_services_commons_node_2.TypeCode.String);
        this.withOptionalProperty('content_id', pip_services_commons_node_2.TypeCode.String);
        this.withOptionalProperty('content_uri', pip_services_commons_node_2.TypeCode.String);
        this.withOptionalProperty('thumbnail_id', pip_services_commons_node_2.TypeCode.String);
        this.withOptionalProperty('thumbnail_uri', pip_services_commons_node_2.TypeCode.String);
        this.withOptionalProperty('create_time', null); //TypeCode.DateTime);
        this.withOptionalProperty('expire_time', null); //TypeCode.DateTime);
        this.withOptionalProperty('attributes', pip_services_commons_node_2.TypeCode.Map);
        /* Custom fields */
        this.withOptionalProperty('custom_hdr', null);
        this.withOptionalProperty('custom_dat', null);
    }
}
exports.FileV1Schema = FileV1Schema;
//# sourceMappingURL=FileV1Schema.js.map