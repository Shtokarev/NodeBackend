import logger from './logger';

export const {
  PORT,
  MONGODB_CONNECTION_STRING,
  REDIS_HOST,
  SENTRY_DSN,
  CORS_ORIGIN,
  MONGOOSE_CONNECTION_STRING,
  SEQUELIZE_CONNECTION_STRING,
} = process.env;

export const NODE_ENV = process.env.NODE_ENV || 'development';

const requiredEnvVariables = [
  'PORT',
  'MONGODB_CONNECTION_STRING',
  'REDIS_HOST',
  'SENTRY_DSN',
  'CORS_ORIGIN',
  'MONGOOSE_CONNECTION_STRING',
  'SEQUELIZE_CONNECTION_STRING',
];

requiredEnvVariables.forEach(name => {
  if (!process.env[name]) {
    throw new Error(`${name} environment variable is required`);
  }
});

logger.log('environment variables loaded');
