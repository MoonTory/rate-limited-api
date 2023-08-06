import { Router } from 'express';
import { IConfig } from '../config';

export abstract class IController {
	protected readonly _path: string;
	protected readonly _config: IConfig;
	public readonly router: Router;

	constructor(path: string, config: IConfig) {
		this._path = path;
		this._config = config;
		this.router = Router();
	}

	public path = () => this._path;
}
