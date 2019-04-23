import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';

import { FilesServiceFactory } from '../build/FilesServiceFactory';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

export class FilesProcess extends ProcessContainer {

    public constructor() {
        super("files", "File management microservice");
        this._factories.add(new FilesServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
