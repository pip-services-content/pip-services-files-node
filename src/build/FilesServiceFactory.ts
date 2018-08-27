import { Factory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';

import { FilesMongoDbPersistence } from '../persistence/FilesMongoDbPersistence';
import { FilesFilePersistence } from '../persistence/FilesFilePersistence';
import { FilesMemoryPersistence } from '../persistence/FilesMemoryPersistence';

import { FilesController } from '../logic/FilesController';
import { FilesHttpServiceV1 } from '../services/version1/FilesHttpServiceV1';
import { FilesSenecaServiceV1 } from '../services/version1/FilesSenecaServiceV1'; 

export class FilesServiceFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-files", "factory", "default", "default", "1.0");

	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-files", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("pip-services-files", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-files", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-files", "controller", "default", "*", "1.0");
	public static SenecaServiceDescriptor = new Descriptor("pip-services-files", "service", "seneca", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-files", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(FilesServiceFactory.MemoryPersistenceDescriptor, FilesMemoryPersistence);
		this.registerAsType(FilesServiceFactory.FilePersistenceDescriptor, FilesFilePersistence);
		this.registerAsType(FilesServiceFactory.MongoDbPersistenceDescriptor, FilesMongoDbPersistence);
		this.registerAsType(FilesServiceFactory.ControllerDescriptor, FilesController);
		this.registerAsType(FilesServiceFactory.SenecaServiceDescriptor, FilesSenecaServiceV1);
		this.registerAsType(FilesServiceFactory.HttpServiceDescriptor, FilesHttpServiceV1);
	}
	
}
