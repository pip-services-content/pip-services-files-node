"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const FilesMongoDbPersistence_1 = require("../persistence/FilesMongoDbPersistence");
const FilesFilePersistence_1 = require("../persistence/FilesFilePersistence");
const FilesMemoryPersistence_1 = require("../persistence/FilesMemoryPersistence");
const FilesController_1 = require("../logic/FilesController");
const FilesHttpServiceV1_1 = require("../services/version1/FilesHttpServiceV1");
const FilesSenecaServiceV1_1 = require("../services/version1/FilesSenecaServiceV1");
class FilesFactory extends pip_services_commons_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(FilesFactory.MemoryPersistenceDescriptor, FilesMemoryPersistence_1.FilesMemoryPersistence);
        this.registerAsType(FilesFactory.FilePersistenceDescriptor, FilesFilePersistence_1.FilesFilePersistence);
        this.registerAsType(FilesFactory.MongoDbPersistenceDescriptor, FilesMongoDbPersistence_1.FilesMongoDbPersistence);
        this.registerAsType(FilesFactory.ControllerDescriptor, FilesController_1.FilesController);
        this.registerAsType(FilesFactory.SenecaServiceDescriptor, FilesSenecaServiceV1_1.FilesSenecaServiceV1);
        this.registerAsType(FilesFactory.HttpServiceDescriptor, FilesHttpServiceV1_1.FilesHttpServiceV1);
    }
}
FilesFactory.Descriptor = new pip_services_commons_node_2.Descriptor("pip-services-files", "factory", "default", "default", "1.0");
FilesFactory.MemoryPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-files", "persistence", "memory", "*", "1.0");
FilesFactory.FilePersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-files", "persistence", "file", "*", "1.0");
FilesFactory.MongoDbPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-files", "persistence", "mongodb", "*", "1.0");
FilesFactory.ControllerDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-files", "controller", "default", "*", "1.0");
FilesFactory.SenecaServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-files", "service", "seneca", "*", "1.0");
FilesFactory.HttpServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-files", "service", "http", "*", "1.0");
exports.FilesFactory = FilesFactory;
//# sourceMappingURL=FilesFactory.js.map