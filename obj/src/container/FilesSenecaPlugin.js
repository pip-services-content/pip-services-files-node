"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_commons_node_5 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
const pip_services_net_node_2 = require("pip-services-net-node");
const FilesMemoryPersistence_1 = require("../persistence/FilesMemoryPersistence");
const FilesFilePersistence_1 = require("../persistence/FilesFilePersistence");
const FilesMongoDbPersistence_1 = require("../persistence/FilesMongoDbPersistence");
const FilesController_1 = require("../logic/FilesController");
const FilesSenecaServiceV1_1 = require("../services/version1/FilesSenecaServiceV1");
class FilesSenecaPlugin extends pip_services_net_node_1.SenecaPlugin {
    constructor(seneca, options) {
        super('pip-services-files', seneca, FilesSenecaPlugin.createReferences(seneca, options));
    }
    static createReferences(seneca, options) {
        options = options || {};
        let logger = new pip_services_commons_node_4.ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(pip_services_commons_node_3.ConfigParams.fromValue(loggerOptions));
        let controller = new FilesController_1.FilesController();
        let persistence;
        let persistenceOptions = options['persistence'] || {};
        let persistenceType = persistenceOptions.type || 'memory';
        if (persistenceType == 'mongodb')
            persistence = new FilesMongoDbPersistence_1.FilesMongoDbPersistence();
        else if (persistenceType == 'file')
            persistence = new FilesFilePersistence_1.FilesFilePersistence();
        else if (persistenceType == 'memory')
            persistence = new FilesMemoryPersistence_1.FilesMemoryPersistence();
        else
            throw new pip_services_commons_node_5.ConfigException(null, 'WRONG_PERSISTENCE_TYPE', 'Unrecognized info persistence type: ' + persistenceType);
        persistence.configure(pip_services_commons_node_3.ConfigParams.fromValue(persistenceOptions));
        let senecaInstance = new pip_services_net_node_2.SenecaInstance(seneca);
        let service = new FilesSenecaServiceV1_1.FilesSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(pip_services_commons_node_3.ConfigParams.fromValue(serviceOptions));
        return pip_services_commons_node_1.References.fromTuples(new pip_services_commons_node_2.Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger, new pip_services_commons_node_2.Descriptor('pip-services-net', 'seneca', 'instance', 'default', '1.0'), senecaInstance, new pip_services_commons_node_2.Descriptor('pip-services-files', 'persistence', persistenceType, 'default', '1.0'), persistence, new pip_services_commons_node_2.Descriptor('pip-services-files', 'controller', 'default', 'default', '1.0'), controller, new pip_services_commons_node_2.Descriptor('pip-services-files', 'service', 'seneca', 'default', '1.0'), service);
    }
}
exports.FilesSenecaPlugin = FilesSenecaPlugin;
module.exports = function (options) {
    let seneca = this;
    let plugin = new FilesSenecaPlugin(seneca, options);
    return { name: plugin.name };
};
//# sourceMappingURL=FilesSenecaPlugin.js.map