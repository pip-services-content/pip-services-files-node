import { Descriptor } from 'pip-services-commons-node';
import { CommandableHttpService } from 'pip-services-net-node';

export class FilesHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('files');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-files', 'controller', 'default', '*', '1.0'));
    }
}