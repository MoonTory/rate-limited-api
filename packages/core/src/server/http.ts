import debug from 'debug';
import express from 'express';
import http from 'http';

/**
 * MicroHTTP is a singletion class is utilized as an http interface for the application. On first initialization, a
 * 'port' property & an 'express' instance must be provided, so that it may properly configured. The application will
 * throw a warning if none was provided on initialization.
 * @class LunaHttp
 */
export class MicroHTTP extends http.Server {
	private static _instance: MicroHTTP;
	private _port?: string | number | boolean;

	private constructor(port: string | number, express?: express.Application) {
		super(express);

		// Get port from environment and initialize TsukiServer.
		this._port = this.normalizePort(port as string | number);

		this.on('error', this.onError);
		this.on('listening', this.onListening);
	}

	/**
	 * Instance getter method, pass port & express properties on first initialization. Otherwise the function will either
	 * throw a 'warning' for when no 'port' is provided, and defaulting to 5007; and throws an 'Fatal Error' when no
	 * express application is provided.
	 * @class LunaHttp
	 * @static
	 * @param port string | number | undefined
	 * @param express express.Application | undefined
	 * @returns LunaHttp
	 */
	public static getInstance(port?: string | number, express?: express.Application): MicroHTTP {
		if (!MicroHTTP._instance) {
			if (!port) {
				process.emitWarning(
					new Error(
						"WARNING: A 'port' property was not defined, defaulting to 5007. Please provide a 'port' on first intialization to get rid of this warning..."
					)
				);
				port = 5007;
			} else if (!express) {
				throw new Error('MicroHTTP was unable to initialize, please provide an express instance on first initialization!');
			}

			MicroHTTP._instance = new MicroHTTP(port, express);
			// ... any one time initialization goes here ...
		}
		return MicroHTTP._instance;
	}

	/**
	 * Returns the 'port' property of the LunaHttp instance. This is a getter method.
	 * @param void
	 * @returns string | number | boolean | undefined
	 */
	public port(): string | number | boolean | undefined {
		return this._port;
	}

	/**
	 * Event listener for HTTP server "error" event.
	 */
	private onError(error: NodeJS.ErrnoException): void {
		if (error.syscall !== 'listen') {
			throw error;
		}
		const bind = typeof this._port === 'string' ? 'Pipe ' + this._port : 'Port ' + this._port;
		switch (error.code) {
			case 'EACCES':
				console.error(`${bind} requires elevated privileges`);
				process.exit(1);
				break;
			case 'EADDRINUSE':
				console.error(`${bind} is already in use`);
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	/**
	 * Event listener for HTTP server "listening" event.
	 */
	private onListening(): void {
		const addr: any = this.address();
		const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
		debug(`Listening on ${bind}`);
	}

	/**
	 * Normalize a port into a number, string, or false.
	 */
	private normalizePort(val: number | string): number | string | boolean {
		const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
		if (isNaN(port)) {
			return val;
		} else if (port >= 0) {
			return port;
		} else {
			return false;
		}
	}
}
