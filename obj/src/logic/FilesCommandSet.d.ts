import { CommandSet } from 'pip-services3-commons-node';
import { IFilesController } from './IFilesController';
export declare class FilesCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IFilesController);
    private makeGetGroupsCommand;
    private makeGetFilesByFilterCommand;
    private makeGetFilesByIdsCommand;
    private makeGetFileByIdCommand;
    private makeCreateFileCommand;
    private makeUpdateFileCommand;
    private makeDeleteFileByIdCommand;
}
