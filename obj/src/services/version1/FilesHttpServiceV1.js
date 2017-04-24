"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
class FilesHttpServiceV1 extends pip_services_net_node_1.CommandableHttpService {
    constructor() {
        super('files');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-files', 'controller', 'default', '*', '1.0'));
    }
}
exports.FilesHttpServiceV1 = FilesHttpServiceV1;
//# sourceMappingURL=FilesHttpServiceV1.js.map