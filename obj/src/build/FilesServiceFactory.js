"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const FilesMongoDbPersistence_1 = require("../persistence/FilesMongoDbPersistence");
const FilesFilePersistence_1 = require("../persistence/FilesFilePersistence");
const FilesMemoryPersistence_1 = require("../persistence/FilesMemoryPersistence");
const FilesController_1 = require("../logic/FilesController");
const FilesHttpServiceV1_1 = require("../services/version1/FilesHttpServiceV1");
class FilesServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(FilesServiceFactory.MemoryPersistenceDescriptor, FilesMemoryPersistence_1.FilesMemoryPersistence);
        this.registerAsType(FilesServiceFactory.FilePersistenceDescriptor, FilesFilePersistence_1.FilesFilePersistence);
        this.registerAsType(FilesServiceFactory.MongoDbPersistenceDescriptor, FilesMongoDbPersistence_1.FilesMongoDbPersistence);
        this.registerAsType(FilesServiceFactory.ControllerDescriptor, FilesController_1.FilesController);
        this.registerAsType(FilesServiceFactory.HttpServiceDescriptor, FilesHttpServiceV1_1.FilesHttpServiceV1);
    }
}
FilesServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-files", "factory", "default", "default", "1.0");
FilesServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-files", "persistence", "memory", "*", "1.0");
FilesServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-files", "persistence", "file", "*", "1.0");
FilesServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-files", "persistence", "mongodb", "*", "1.0");
FilesServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-files", "controller", "default", "*", "1.0");
FilesServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-files", "service", "http", "*", "1.0");
exports.FilesServiceFactory = FilesServiceFactory;
//# sourceMappingURL=FilesServiceFactory.js.map