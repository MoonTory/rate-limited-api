import { Redis as RedisClient } from 'ioredis';
import { config } from '../../config';

export type RedisCommandResults = [error: Error | null, result: any][];

export class Redis {
	private static _instance: Redis;
	public readonly client: RedisClient;

	private constructor() {
		this.client = new RedisClient({
			host: config.REDIS_HOST,
			port: config.REDIS_PORT
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
