"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
class FilesHttpServiceV1 extends pip_services_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/files');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-files', 'controller', 'default', '*', '1.0'));
    }
}
exports.FilesHttpServiceV1 = FilesHttpServiceV1;
//# sourceMappingURL=FilesHttpServiceV1.js.map