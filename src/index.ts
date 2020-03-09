import * as sentry from '@sentry/node';

import logger from './utils/logger';
import { initMongodbClient } from './utils/init-mongo';
import { initRedisClient } from './utils/init-redis';
import {
  PORT,
  REDIS_HOST,
  MONGODB_CONNECTION_STRING,
  SENTRY_DSN,
} from './utils/env-loader';
import initApp, { AppConfiguration } from './app';

logger.init(console);

// TO-DO add dependency injection
const loadAppDependencies = async (): Promise<AppConfiguration> => {
  let db;
  let redis;

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
    sentry.init({ dsn: SENTRY_DSN });
  } catch (error) {
    logger.log(error);
  }

  return { db, redis, sentry };
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
