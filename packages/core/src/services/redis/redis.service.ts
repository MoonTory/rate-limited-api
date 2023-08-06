import { createClient, RedisClientType } from 'redis';
import { config } from '../../config';

export class Redis {
	private static _instance: Redis;
	public readonly client: RedisClientType;

	private constructor() {
		this.client = createClient({
			socket: {
				host: config.REDIS_HOST,
				port: config.REDIS_PORT
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
