"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let Mixed = mongoose_1.Schema.Types.Mixed;
exports.FilesMongoDbSchema = function (collection) {
    collection = collection || 'files';
    let schema = new mongoose_1.Schema({
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
    }, {
        collection: collection,
        autoIndex: true,
        strict: true
    });
    schema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });
    return schema;
};
//# sourceMappingURL=FilesMongoDbSchema.js.map