/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';

import logger from '../utils/logger';
import { ServerResponse } from '../types';


export const test = (req: Request, res: Response) => {
  logger.log('incoming GET on route /test');

  const response: ServerResponse = {
    data: { array: ['Hello', 'world', 'response', '!'] },
  };

  return res.status(200).json(response);
};
