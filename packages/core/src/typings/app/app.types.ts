import { IConfig } from '../config';
import { IDatabase } from '../db';
import { IServer } from '../server';

export abstract class IApplication {
	protected readonly _config: IConfig;
	protected _database: IDatabase<any>;
	protected _server: IServer;
	protected _redis: any;

	constructor(config: IConfig) {
		this._config = config;
	}

	abstract start(): Promise<void | any>;
}
