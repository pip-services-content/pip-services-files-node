"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const FilesFactory_1 = require("../build/FilesFactory");
class FilesProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("files", "File management microservice");
        this._factories.add(new FilesFactory_1.FilesFactory);
    }
}
exports.FilesProcess = FilesProcess;
//# sourceMappingURL=FilesProcess.js.map