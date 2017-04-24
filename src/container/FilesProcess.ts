import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { FilesFactory } from '../build/FilesFactory';

export class FilesProcess extends ProcessContainer {

    public constructor() {
        super("files", "File management microservice");
        this._factories.add(new FilesFactory);
    }

}
