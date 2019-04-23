import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class FileV1Schema extends ObjectSchema {
    public constructor() {
        super();

        /* Identification */
        this.withOptionalProperty('id', TypeCode.String);
        this.withOptionalProperty('group', TypeCode.String);
        this.withRequiredProperty('name', TypeCode.String);

        /* Content */
        this.withOptionalProperty('description', TypeCode.String);
        this.withOptionalProperty('content_id', TypeCode.String);
        this.withOptionalProperty('content_uri', TypeCode.String);
        this.withOptionalProperty('thumbnail_id', TypeCode.String);
        this.withOptionalProperty('thumbnail_uri', TypeCode.String);
        this.withOptionalProperty('create_time', null); //TypeCode.DateTime);
        this.withOptionalProperty('expire_time', null); //TypeCode.DateTime);
        this.withOptionalProperty('attributes', TypeCode.Map);

        /* Custom fields */
        this.withOptionalProperty('custom_hdr', null);
        this.withOptionalProperty('custom_dat', null);
    }
}
