import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import { Db } from 'mongodb';
import * as Sentry from '@sentry/node';
import cors from 'cors';

import { AsyncRedisClient } from './utils/init-redis';
import logger from './utils/logger';
import installRoutes from './routes';
import { CORS_ORIGIN } from './utils/env-loader';


export type Application = Express & {
  locals: {
    db: Db;
    redis: AsyncRedisClient;
  };
};

export interface AppConfiguration {
  db?: Db;
  redis?: AsyncRedisClient;
  sentry?: typeof Sentry;
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

  logger.log('application initialized.');

  appConfig = config;
  application = express();

  if (config?.sentry) {
    application.use(config.sentry.Handlers.requestHandler());
  }

  application.use(bodyParser.urlencoded({ extended: true }));
  application.use(bodyParser.json());

  const whiteCorsList = [CORS_ORIGIN, 'localhost:3000'];
  const corsOptions = {
    origin: function (origin: string, callback: Function) {
      if (whiteCorsList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };
  application.use(cors(corsOptions));

  await installRoutes(application);

  if (config?.sentry) {
    application.use(config.sentry.Handlers.errorHandler());
  }

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
      sentry: (res as Response & { sentry: unknown }).sentry,
    });
  }
  );

  application.locals.db = config.db;
  application.locals.redis = config.redis;
  application.locals.sentry = config.sentry;

  return application;
};

export const killApplicaton = () => {
  application = null;
};

export const getApplication: () => Application = () => application;
export const getAppConfiguration: () => AppConfiguration = () => appConfig;

export default initApp;
