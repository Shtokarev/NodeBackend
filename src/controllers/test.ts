/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';

import logger from '../utils/logger';


export const test = (req: Request, res: Response) => {
  logger.log('incoming GET on route /test');
  logger.error('ERROR log incoming GET on route /test');

  // res.json(result);
  // res.send('Hello world!');
  throw new Error('test error');
};
