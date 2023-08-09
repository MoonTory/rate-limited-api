import fs from 'fs';
import path from 'path';
import { Redis as RedisClient } from 'ioredis';

import { Map } from '../../typings';
import { config } from '../../config';

const scriptsDir = path.join(__dirname, './scripts');

export type RedisCommandResults = [error: Error | null, result: any][];

export class Redis {
	private static _instance: Redis;
	public readonly client: RedisClient;
	public readonly scripts: Map<string> = {};

	private constructor() {
		this.client = new RedisClient({
			host: config.REDIS_HOST,
			port: config.REDIS_PORT
		});

		fs.readdirSync(scriptsDir).forEach((file) => {
			if (path.extname(file) === '.lua') {
				const filePath = path.join(scriptsDir, file);
				this.scripts[file.split('.')[0]] = fs.readFileSync(filePath, 'utf-8');
			}
		});

		this.client.on('connect', () => console.log('Redis initialized...'));
		this.client.on('error', (err) => console.log('Redis Client Error', err));
	}

	public static getInstance(): Redis {
		if (!Redis._instance) {
			Redis._instance = new Redis();
			// ... any one time initialization goes here ...
		}
		return Redis._instance;
	}
}
