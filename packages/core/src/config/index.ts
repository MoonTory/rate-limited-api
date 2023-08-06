import * as env from './env.config';
import { IConfig } from '../typings';

export const config: IConfig = {
	API_VERSION: env.API_VERSION,
	APP_PORT: env.APP_PORT,
	NODE_ENV: env.NODE_ENV,
	DB_CONNECTION_STRING: env.DB_CONNECTION_STRING,
	HOST_URL: env.HOST_URL,
	JWT_SECRET: env.JWT_SECRET,
	MAX_IP_REQUEST_COUNT: env.MAX_IP_REQUEST_COUNT as number,
	MAX_TOKEN_REQUEST_COUNT: env.MAX_TOKEN_REQUEST_COUNT as number,
	REDIS_HOST: env.REDIS_HOST,
	REDIS_PORT: env.REDIS_PORT as number,
	RATE_LIMIT_WINDOW_IN_SECONDS: env.RATE_LIMIT_WINDOW_IN_SECONDS as number
};
