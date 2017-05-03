import { CommandSet } from 'pip-services-commons-node';
import { ICommand } from 'pip-services-commons-node';
import { Command } from 'pip-services-commons-node';
import { Schema } from 'pip-services-commons-node';
import { Parameters } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { ObjectSchema } from 'pip-services-commons-node';
import { ArraySchema } from 'pip-services-commons-node';
import { TypeCode } from 'pip-services-commons-node';
import { FilterParamsSchema } from 'pip-services-commons-node';
import { PagingParamsSchema } from 'pip-services-commons-node';
import { DateTimeConverter } from 'pip-services-commons-node';

import { IFilesController} from './IFilesController';
import { FileV1Schema } from '../data/version1/FileV1Schema';

export class FilesCommandSet extends CommandSet {
    private _logic: IFilesController;

    constructor(logic: IFilesController) {
        super();

        this._logic = logic;

		this.addCommand(this.makeGetGroupsCommand());
		this.addCommand(this.makeGetFilesByFilterCommand());
		this.addCommand(this.makeGetFilesByIdsCommand());
		this.addCommand(this.makeGetFileByIdCommand());
		this.addCommand(this.makeCreateFileCommand());
		this.addCommand(this.makeUpdateFileCommand());
		this.addCommand(this.makeDeleteFileByIdCommand());
    }

	private makeGetGroupsCommand(): ICommand {
		return new Command(
			"get_groups",
			new ObjectSchema(true)
				.withOptionalProperty('paging', new PagingParamsSchema()),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let paging = PagingParams.fromValue(args.get("paging"));
				this._logic.getGroups(correlationId, paging, callback);
			}
		);
	}

	private makeGetFilesByFilterCommand(): ICommand {
		return new Command(
			"get_files_by_filter",
			new ObjectSchema(true)
				.withOptionalProperty("filter", new FilterParamsSchema())
				.withOptionalProperty("paging", new PagingParamsSchema())
			,
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getFilesByFilter(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetFilesByIdsCommand(): ICommand {
		return new Command(
			"get_files_by_ids",
			new ObjectSchema(true)
				.withRequiredProperty("file_ids", new ArraySchema(TypeCode.String)),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let fileIds = args.get("file_id");
                this._logic.getFilesByIds(correlationId, fileIds, callback);
            }
		);
	}

	private makeGetFileByIdCommand(): ICommand {
		return new Command(
			"get_file_by_id",
			new ObjectSchema(true)
				.withRequiredProperty("file_id", TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let fileId = args.getAsNullableString("file_id");
                this._logic.getFileById(correlationId, fileId, callback);
            }
		);
	}

	private makeCreateFileCommand(): ICommand {
		return new Command(
			"create_file",
			new ObjectSchema(true)
				.withRequiredProperty("file", new FileV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let file = args.get("file");
                this._logic.createFile(correlationId, file, callback);
            }
		);
	}

	private makeUpdateFileCommand(): ICommand {
		return new Command(
			"update_file",
			new ObjectSchema(true)
				.withRequiredProperty("file", new FileV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let file = args.get("file");
                this._logic.updateFile(correlationId, file, callback);
            }
		);
	}

	private makeDeleteFileByIdCommand(): ICommand {
		return new Command(
			"delete_file_by_id",
			new ObjectSchema(true)
				.withRequiredProperty("file_id", TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let fileId = args.getAsNullableString("file_id");
                this._logic.deleteFileById(correlationId, fileId, callback);
			}
		);
	}

}