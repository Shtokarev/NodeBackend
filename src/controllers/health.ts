import { Request, Response } from 'express';

import logger from '../utils/logger';
import { getApplication } from '../app';

const application = getApplication();

interface ServerStatus {
  express: string;
  mongodb: string;
  redis: string;
}

export const health = async (req: Request, res: Response) => {
  const appStatus = { express: 'ok' } as ServerStatus;
  logger.log('incoming GET on route /health');

  let status = 200;

  try {
    if (!application.locals.db) {
      throw new Error('mongodb not loaded');
    }

    await application.locals.db.stats();

    appStatus.mongodb = 'ok';
  } catch (error) {
    logger.error(error);
    appStatus.mongodb = error?.message;
    status = 500;
  }

  try {
    if (!application.locals.redis) {
      throw new Error('redis not loaded');
    }

    const pong = await application.locals.redis.ping();

    if (!pong) {
      throw new Error('no pong received from redis');
    }

    appStatus.redis = 'ok';
  } catch (error) {
    logger.error(error);
    appStatus.redis = error?.message;
    status = 500;
  }

  return res.status(status).json(appStatus);
};
