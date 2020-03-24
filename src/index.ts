/* eslint-disable @typescript-eslint/no-var-requires */
import logger from './utils/logger';
import { initMongodbClient } from './utils/init-mongo';
import { initRedisClient } from './utils/init-redis';
import {
  PORT,
  REDIS_HOST,
  MONGODB_CONNECTION_STRING,
} from './utils/env-loader';
import initApp, { AppConfiguration } from './app';
import { DependencyInjectionContainer } from './utils/di-container';

logger.init(console);

const diContainer = new DependencyInjectionContainer();


// diContainer.factory('module1', import('./utils/module2'));
// diContainer.factory('module2', import('./utils/module2'));
// diContainer.factory('module3', import('./utils/module3'));
// diContainer.register('dbName', 'myDb');

// diContainer.register('MONGODB_CONNECTION_STRING', 'myDb');

(async () => {
  try {
    await diContainer.factory('envLoader', await import('./utils/env-loader'));
    await diContainer.factory('mongo', await import('./utils/init-mongo'));

    // diContainer.register('dbName', 'myDb');

    const envLoader = await diContainer.get('envLoader');
    console.log(envLoader);

    const mongo = await diContainer.get('mongo');
    console.log(mongo);
  } catch (err) {
    logger.log(err);
  }
})();



// (async () => {
//   await diContainer.factory('module1', await import('./utils/module1'));
//   await diContainer.factory('module2', await import('./utils/module2'));
//   await diContainer.factory('module3', await import('./utils/module3'));
//   diContainer.register('dbName', 'myDb');
//   const module3 = diContainer.get('module3');
//   logger.log(module3);
//   const module1 = diContainer.get('module1');
//   logger.log(module1);
//   const module2 = diContainer.get('module2');
//   logger.log(module2);
//   const module33 = diContainer.get('module3');
//   logger.log(module33);
// })();


// logger.log(module3);

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

  return { db, redis };
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
