export interface IConfig {
	API_VERSION: string | number;
	APP_PORT: string | number;
	NODE_ENV: string;
	DB_CONNECTION_STRING: string;
	HOST_URL: string;
	JWT_SECRET: string;
	MAX_IP_REQUEST_COUNT: number;
	MAX_TOKEN_REQUEST_COUNT: number;
	REDIS_PORT: number;
	REDIS_HOST: string;
	RATE_LIMIT_WINDOW_IN_SECONDS: number;
}
