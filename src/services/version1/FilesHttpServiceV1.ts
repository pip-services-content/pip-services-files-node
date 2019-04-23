import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class FilesHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/files');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-files', 'controller', 'default', '*', '1.0'));
    }
}