/**
 * Node_Module dependencies.
 */
import cors from 'cors';
import passport from 'passport';
import express, { urlencoded, json } from 'express';

import { MicroAPI } from './api';
import { MicroHTTP } from './http';
import { IServer, IConfig } from '../typings';
import { catch404 } from './middleware/catch404.middleware';
import { clearCache, ErrorHandler, getHostname } from './middleware';

export class MicroServer extends IServer {
	private static _instance: MicroServer;
	private _http: MicroHTTP;
	private _api: MicroAPI;
	private _express: express.Application;

	private constructor(config: IConfig) {
		super(config);
		this._express = express();
		this._express.set('port', this._config.APP_PORT);
		this._api = MicroAPI.getInstance(this._config);
		this._http = MicroHTTP.getInstance(this._config.APP_PORT, this._express);
		this.config();
	}

	public static getInstance(config: IConfig): MicroServer {
		if (!MicroServer._instance) {
			MicroServer._instance = new MicroServer(config);
		}
		return MicroServer._instance;
	}

	public async listen() {
		await this._http.listen(this._http.port(), () => console.log(`Server start @ http://localhost:${this._http.port()} ...`));
	}

	protected async config() {
		this._express.use(cors());
		this._express.use(json());
		this._express.use(urlencoded({ extended: false }));
		this._express.use(passport.initialize());

		this._express.use('/hit', getHostname());
		this._express.use('/clear-cache', clearCache());

		this._express.use(this._api.router);

		this._express.use(catch404());
		this._express.use(ErrorHandler);
	}
}
