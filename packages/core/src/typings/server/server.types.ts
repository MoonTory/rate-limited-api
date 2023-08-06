import { IConfig } from '../config';

export abstract class IServer {
	protected readonly _config: IConfig;

	protected constructor(config: IConfig) {
		this._config = config;
	}
	abstract listen(): Promise<void>;
	protected abstract config(): Promise<void>;
}
