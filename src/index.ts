import * as sentry from '@sentry/node';
import https from 'https';

import logger from './utils/logger';
import { initMongodbClient } from './utils/init-mongo';
import { initRedisClient } from './utils/init-redis';
import { initDynamoDb } from './utils/init-dynamodb';
import {
  PORT,
  REDIS_HOST,
  MONGODB_CONNECTION_STRING,
  SENTRY_DSN,
  HTTPS_PORT,
  key,
  cert,
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

  const dynamodb = initDynamoDb();

  return { db, redis, sentry, dynamodb };
};

const loadApplication = async () => {
  try {

    const app = await initApp(await loadAppDependencies());

    app.listen(PORT, () => {
      logger.log(`Http server started on port: ${PORT}`);
    });

    if (key && cert) {
      https.createServer({ key, cert }, app).listen(HTTPS_PORT, function () {
        logger.log(`Https listening on port ${HTTPS_PORT}`);
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

loadApplication();
