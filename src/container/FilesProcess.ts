import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { FilesServiceFactory } from '../build/FilesServiceFactory';
import { DefaultRpcFactory } from 'pip-services-rpc-node';

export class FilesProcess extends ProcessContainer {

    public constructor() {
        super("files", "File management microservice");
        this._factories.add(new FilesServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
