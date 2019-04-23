"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const FilesServiceFactory_1 = require("../build/FilesServiceFactory");
class FilesLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("files", "File management function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-files', 'controller', 'default', '*', '*'));
        this._factories.add(new FilesServiceFactory_1.FilesServiceFactory());
    }
}
exports.FilesLambdaFunction = FilesLambdaFunction;
exports.handler = new FilesLambdaFunction().getHandler();
//# sourceMappingURL=FilesLambdaFunction.js.map