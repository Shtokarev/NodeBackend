import { Request, Response } from 'express';

import logger from '../utils/logger';

export const test = (req: Request, res: Response) => {
  logger.log('incoming test GET');
  res.send('Hello world!');
};
