export const {
	API_VERSION = process.env.API_VERSION || '1',
	APP_PORT = process.env.PORT || 5000,
	NODE_ENV = process.env.NODE_ENV || 'development',
	HOST_URL = process.env.HOST_URL || '',
	JWT_SECRET = process.env.JWT_SECRET || '',

	// Mongo Config
	DB_USER = process.env.DB_USER,
	DB_PASS = process.env.DB_PASS,
	DB_HOST = process.env.DB_HOST,
	DB_PORT = process.env.DB_PORT,
	DB_NAME = process.env.DB_NAME,
	DB_CONNECTION_STRING = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,

	MAX_IP_REQUEST_COUNT = process.env.MAX_TOKEN_REQUEST_COUNT || 100,
	MAX_TOKEN_REQUEST_COUNT = process.env.MAX_TOKEN_REQUEST_COUNT || 200,
	RATE_LIMIT_WINDOW_IN_SECONDS = process.env.RATE_LIMIT_WINDOW_IN_SECONDS || 3600,

	// Redis Config
	REDIS_HOST = process.env.REDIS_HOST || 'localhost',
	REDIS_PORT = process.env.REDIS_PORT || 6379
} = process.env;
