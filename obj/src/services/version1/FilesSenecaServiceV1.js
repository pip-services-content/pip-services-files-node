"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_seneca_node_1 = require("pip-services-seneca-node");
class FilesSenecaServiceV1 extends pip_services_seneca_node_1.CommandableSenecaService {
    constructor() {
        super('files');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-files', 'controller', 'default', '*', '1.0'));
    }
}
exports.FilesSenecaServiceV1 = FilesSenecaServiceV1;
//# sourceMappingURL=FilesSenecaServiceV1.js.map