import { IConfig } from '../config';

export abstract class IDatabase<T> {
	protected readonly _config: IConfig;
	protected _connectionString: string;
	protected _connection: T;

	constructor(config: IConfig) {
		this._config = config;
	}

	public get connection(): T {
		return this._connection;
	}

	public abstract connect(): Promise<void>;
}
