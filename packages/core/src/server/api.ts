import { Router } from 'express';

import { IController, IConfig } from '../typings';
import { PublicController, PrivateController } from './controllers';

export class MicroAPI {
	private static _instance: MicroAPI;
	private readonly _config: IConfig;
	private readonly _path: string;
	private readonly _controllers: IController[];
	public router: Router;

	private constructor(config: IConfig) {
		this.router = Router();
		this._config = config;
		this._path = `/v${this._config.API_VERSION}`;
		this._controllers = [new PublicController('/public', config), new PrivateController('/private', config)];
		this.initialize();
	}

	private initialize() {
		this._controllers.forEach((cntrl: IController) => {
			this.router.use(this._path, cntrl.router);
		});
	}

	public static getInstance(config: IConfig): MicroAPI {
		if (!MicroAPI._instance) {
			MicroAPI._instance = new MicroAPI(config);
		}
		return MicroAPI._instance;
	}
}
