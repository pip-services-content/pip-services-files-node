"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_commons_node_5 = require("pip-services-commons-node");
const pip_services_commons_node_6 = require("pip-services-commons-node");
const pip_services_commons_node_7 = require("pip-services-commons-node");
const pip_services_commons_node_8 = require("pip-services-commons-node");
const pip_services_commons_node_9 = require("pip-services-commons-node");
const FileV1Schema_1 = require("../data/version1/FileV1Schema");
class FilesCommandSet extends pip_services_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        this.addCommand(this.makeGetFilesByFilterCommand());
        this.addCommand(this.makeGetFilesByIdsCommand());
        this.addCommand(this.makeGetFileByIdCommand());
        this.addCommand(this.makeCreateFileCommand());
        this.addCommand(this.makeUpdateFileCommand());
        this.addCommand(this.makeDeleteFileByIdCommand());
    }
    makeGetFilesByFilterCommand() {
        return new pip_services_commons_node_2.Command("get_files_by_filter", new pip_services_commons_node_5.ObjectSchema(true)
            .withOptionalProperty("filter", new pip_services_commons_node_8.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services_commons_node_9.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getFilesByFilter(correlationId, filter, paging, callback);
        });
    }
    makeGetFilesByIdsCommand() {
        return new pip_services_commons_node_2.Command("get_files_by_ids", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("file_ids", new pip_services_commons_node_6.ArraySchema(pip_services_commons_node_7.TypeCode.String)), (correlationId, args, callback) => {
            let fileIds = args.get("file_id");
            this._logic.getFilesByIds(correlationId, fileIds, callback);
        });
    }
    makeGetFileByIdCommand() {
        return new pip_services_commons_node_2.Command("get_file_by_id", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("file_id", pip_services_commons_node_7.TypeCode.String), (correlationId, args, callback) => {
            let fileId = args.getAsNullableString("file_id");
            this._logic.getFileById(correlationId, fileId, callback);
        });
    }
    makeCreateFileCommand() {
        return new pip_services_commons_node_2.Command("create_file", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("file", new FileV1Schema_1.FileV1Schema()), (correlationId, args, callback) => {
            let file = args.get("file");
            this._logic.createFile(correlationId, file, callback);
        });
    }
    makeUpdateFileCommand() {
        return new pip_services_commons_node_2.Command("update_file", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("file", new FileV1Schema_1.FileV1Schema()), (correlationId, args, callback) => {
            let file = args.get("file");
            this._logic.updateFile(correlationId, file, callback);
        });
    }
    makeDeleteFileByIdCommand() {
        return new pip_services_commons_node_2.Command("delete_file_by_id", new pip_services_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("file_id", pip_services_commons_node_7.TypeCode.String), (correlationId, args, callback) => {
            let fileId = args.getAsNullableString("file_id");
            this._logic.deleteFileById(correlationId, fileId, callback);
        });
    }
}
exports.FilesCommandSet = FilesCommandSet;
//# sourceMappingURL=FilesCommandSet.js.map