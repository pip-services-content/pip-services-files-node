import { StringValueMap } from 'pip-services-commons-node';
export declare class FileV1 {
    constructor(id: string, group: string, name: string, description?: string, content_id?: string, content_uri?: string, expire_time?: Date, attributes?: StringValueMap);
    id: string;
    group: string;
    name: string;
    description: string;
    content_id: string;
    content_uri: string;
    thumbnail_id: string;
    thumbnail_uri: string;
    create_time: Date;
    expire_time: Date;
    attributes: StringValueMap;
    custom_hdr: any;
    custom_dat: any;
}
