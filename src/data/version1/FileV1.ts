import { StringValueMap } from 'pip-services-commons-node';

export class FileV1 {

    public constructor(id: string, group: string, name: string,
        description?: string, content_id?: string, content_uri?: string,
        expire_time?: Date, attributes?: StringValueMap) {
        this.id = id;
        this.group = group;
        this.name = name;
        this.description = description;
        this.content_id = content_id;
        this.content_uri = content_uri;
        this.create_time = new Date();
        this.expire_time = expire_time;
        this.attributes = attributes || new StringValueMap();
    }

    /* Identification */
    public id: string;
    public group: string;
    public name: string;

    /* Content */
    public description: string;
    public content_id: string;
    public content_uri: string;
    public thumbnail_id: string;
    public thumbnail_uri: string;
    public create_time: Date;
    public expire_time: Date;
    public attributes: StringValueMap;

    /* Custom fields */
    public custom_hdr: any;
    public custom_dat: any;
}