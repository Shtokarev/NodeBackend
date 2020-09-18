/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from 'express';

import logger from '../utils/logger';
import { ServerResponse } from '../types';


export const test: RequestHandler = (req, res) => {
  logger.log('incoming GET on route /test');

  const response: ServerResponse = {
    data: { array: ['Hello', 'world', 'response', '!'] },
  };

  return res.status(200).json(response);
};
