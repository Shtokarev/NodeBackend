import * as sentry from '@sentry/node';

import logger from './utils/logger';
import { initMongodbClient } from './initialization/init-mongo';
import { initRedisClient } from './initialization/init-redis';
import { initSequelizeClient } from './initialization/init-sequelize';
import {
  PORT,
  REDIS_HOST,
  MONGODB_CONNECTION_STRING,
  SEQUELIZE_CONNECTION_STRING,
  SENTRY_DSN,
} from './utils/env-loader';
import initApp, { AppConfiguration } from './app';

logger.init(console);

// TO-DO add dependency injection
const loadAppDependencies = async (): Promise<AppConfiguration> => {
  let db;
  let redis;
  let dbSequelize;

  try {
    db = await initMongodbClient({ connectionString: MONGODB_CONNECTION_STRING });
  } catch (error) {
    logger.log(error);
  }

  try {
    redis = await initRedisClient({ host: REDIS_HOST });
  } catch (error) {
    logger.log(error);
  }

  try {
    dbSequelize = await initSequelizeClient({ connectionString: SEQUELIZE_CONNECTION_STRING });
  } catch (error) {
    logger.log(error);
  }

  try {
    sentry.init({ dsn: SENTRY_DSN });
  } catch (error) {
    logger.log(error);
  }

  return { db, redis, dbSequelize, sentry };
};

const loadApplication = async () => {
  try {
    const app = await initApp(await loadAppDependencies());

    app.listen(PORT, () => {
      console.log(`server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(error);
  }
};

loadApplication();
