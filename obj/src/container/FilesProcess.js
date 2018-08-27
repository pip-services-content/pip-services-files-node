"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const FilesServiceFactory_1 = require("../build/FilesServiceFactory");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
class FilesProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("files", "File management microservice");
        this._factories.add(new FilesServiceFactory_1.FilesServiceFactory);
        this._factories.add(new pip_services_rpc_node_1.DefaultRpcFactory);
    }
}
exports.FilesProcess = FilesProcess;
//# sourceMappingURL=FilesProcess.js.map