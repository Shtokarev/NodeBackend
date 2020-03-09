import { Request, Response } from 'express';
import {
  PORT,
  REDIS_HOST,
  MONGODB_CONNECTION_STRING,
} from '../utils/env-loader';


import logger from '../utils/logger';

export const test = (req: Request, res: Response) => {
  logger.log('incoming GET on route /test');
  const result = {
    PORT,
    REDIS_HOST,
    MONGODB_CONNECTION_STRING,
  };
  res.json(result);
};
