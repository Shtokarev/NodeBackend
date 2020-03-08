import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import { Db } from 'mongodb';

import { AsyncRedisClient } from './utils/init-redis';
import logger from './utils/logger';
import installRoutes from './routes';


export type Application = Express & {
  locals: {
    db: Db;
    redis: AsyncRedisClient;
  };
};

export interface AppConfiguration {
  db?: Db;
  redis?: AsyncRedisClient;
}

interface ExpressError {
  message: string;
  route: string;
  status: number;
}

let application: Application = null;
let appConfig: AppConfiguration = null;

const initApp = async (config?: AppConfiguration): Promise<Application> => {
  if (application !== null) {
    return application;
  }

  logger.log('application initialized');

  appConfig = config;
  application = express();

  application.use(bodyParser.urlencoded({ extended: true }));
  application.use(bodyParser.json());

  await installRoutes(application);

  application.use((error: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const errorStatus = error.status || 500;

    if (errorStatus >= 500) {
      logger.error(`Error: ${error.message} on route: ${error.route}`);
    } else if (errorStatus >= 400) {
      logger.log(`Warning: ${error.message}`);
    } else {
      return next();
    }

    return res.status(errorStatus).json({
      message: error.message,
    });
  }
  );

  application.locals.db = config.db;
  application.locals.redis = config.redis;

  return application;
};

export const killApplicaton = () => {
  application = null;
};

export const getApplication: () => Application = () => application;
export const getAppConfiguration: () => AppConfiguration = () => appConfig;

export default initApp;
