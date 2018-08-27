import { Descriptor } from 'pip-services-commons-node';
import { CommandableSenecaService } from 'pip-services-seneca-node';

export class FilesSenecaServiceV1 extends CommandableSenecaService {
    public constructor() {
        super('files');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-files', 'controller', 'default', '*', '1.0'));
    }
}