"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_aws_node_1 = require("pip-services-aws-node");
const FilesFactory_1 = require("../build/FilesFactory");
class FilesLambdaFunction extends pip_services_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("files", "File management function");
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-files', 'controller', 'default', '*', '*'));
        this._factories.add(new FilesFactory_1.FilesFactory());
    }
}
exports.FilesLambdaFunction = FilesLambdaFunction;
exports.handler = new FilesLambdaFunction().getHandler();
//# sourceMappingURL=FilesLambdaFunction.js.map