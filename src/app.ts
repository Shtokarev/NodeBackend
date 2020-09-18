import bodyParser from 'body-parser';
import express, { NextFunction, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import logger from './utils/logger';
import installRoutes from './routes';
import { CORS_ORIGIN } from './utils/env-loader';
import {
  Application,
  AppConfiguration,
  AppRequest,
  ExpressError,
  ServerResponse,
} from './types';

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
  application.use(bodyParser.json({
    type: ['application/json', 'text/plain'],
  }));

  const whiteCorsList = CORS_ORIGIN.split(' ');
  const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
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

  application.use((error: ExpressError, req: AppRequest, res: Response, next: NextFunction) => {
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
    } as ServerResponse);
  });

  application.locals.db = config.db;
  application.locals.redis = config.redis;
  application.locals.sentry = config.sentry;
  application.locals.dynamodb = config.dynamodb;

  return application;
};

export const killApplicaton = (): void => {
  application = null;
};

export const getApplication: () => Application = () => application;
export const getAppConfiguration: () => AppConfiguration = () => appConfig;

export default initApp;
