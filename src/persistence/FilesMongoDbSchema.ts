import { Schema } from 'mongoose';
let Mixed = Schema.Types.Mixed;

export let FilesMongoDbSchema = function(collection?: string) {
    collection = collection || 'files';

    let schema = new Schema(
        {
            /* Identification */
            _id: { type: String, unique: true },
            group: { type: String, required: true },
            name: { type: String, required: true },

            /* Content */
            description: { type: String, required: false },
            content_id: { type: String, required: false },
            content_uri: { type: String, required: false },
            thumbnail_id: { type: String, required: false },
            thumbnail_uri: { type: String, required: false },
            create_time: { type: Date, required: true, 'default': Date.now },
            expire_time: { type: Date, required: false },
            attributes: { type: Mixed, required: false },
            
            /* Custom fields */
            custom_hdr: { type: Mixed, required: false },
            custom_dat: { type: Mixed, required: false }
        },
        {
            collection: collection,
            autoIndex: true,
            strict: true
        }
    );

    schema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    return schema;
}
