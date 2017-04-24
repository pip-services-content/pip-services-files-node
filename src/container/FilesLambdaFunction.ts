import { Descriptor } from 'pip-services-commons-node';
import { CommandableLambdaFunction } from 'pip-services-aws-node';
import { FilesFactory } from '../build/FilesFactory';

export class FilesLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("files", "File management function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-files', 'controller', 'default', '*', '*'));
        this._factories.add(new FilesFactory());
    }
}

export const handler = new FilesLambdaFunction().getHandler();