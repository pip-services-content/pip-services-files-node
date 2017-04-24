import { CommandSet } from 'pip-services-commons-node';
import { IFilesController } from './IFilesController';
export declare class FilesCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IFilesController);
    private makeGetFilesByFilterCommand();
    private makeGetFilesByIdsCommand();
    private makeGetFileByIdCommand();
    private makeCreateFileCommand();
    private makeUpdateFileCommand();
    private makeDeleteFileByIdCommand();
}
