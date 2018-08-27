import { References } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-components-node';
import { ConfigException } from 'pip-services-commons-node';
import { SenecaPlugin } from 'pip-services-seneca-node';
import { SenecaInstance } from 'pip-services-seneca-node';

import { FilesMemoryPersistence } from '../persistence/FilesMemoryPersistence';
import { FilesFilePersistence } from '../persistence/FilesFilePersistence';
import { FilesMongoDbPersistence } from '../persistence/FilesMongoDbPersistence';
import { FilesController } from '../logic/FilesController';
import { FilesSenecaServiceV1 } from '../services/version1/FilesSenecaServiceV1';

export class FilesSenecaPlugin extends SenecaPlugin {
    public constructor(seneca: any, options: any) {
        super('pip-services-files', seneca, FilesSenecaPlugin.createReferences(seneca, options));
    }

    private static createReferences(seneca: any, options: any): References {
        options = options || {};

        let logger = new ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(ConfigParams.fromValue(loggerOptions));

        let controller = new FilesController();

        let persistence;
        let persistenceOptions = options['persistence'] || {};
        let persistenceType = persistenceOptions.type || 'memory';
        if (persistenceType == 'mongodb') 
            persistence = new FilesMongoDbPersistence();
        else if (persistenceType == 'file')
            persistence = new FilesFilePersistence();
        else if (persistenceType == 'memory')
            persistence = new FilesMemoryPersistence();
        else 
            throw new ConfigException(null, 'WRONG_PERSISTENCE_TYPE', 'Unrecognized info persistence type: ' + persistenceType);
        persistence.configure(ConfigParams.fromValue(persistenceOptions));

        let senecaInstance = new SenecaInstance(seneca);

        let service = new FilesSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(ConfigParams.fromValue(serviceOptions));

        return References.fromTuples(
            new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-seneca', 'seneca', 'instance', 'default', '1.0'), senecaInstance,
            new Descriptor('pip-services-files', 'persistence', persistenceType, 'default', '1.0'), persistence,
            new Descriptor('pip-services-files', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-files', 'service', 'seneca', 'default', '1.0'), service
        );
    }
}

module.exports = function(options: any): any {
    let seneca = this;
    let plugin = new FilesSenecaPlugin(seneca, options);
    return { name: plugin.name };
}