/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';

import logger from '../utils/logger';


export const chatApiWebhook = (req: Request, res: Response) => {
  logger.log('incoming POST on route /chat-api-webhook');

  const data = req.body;

  for (const i in data.messages) {
    const author = data.messages[i].author;
    const body = data.messages[i].body;
    const chatId = data.messages[i].chatId;
    const senderName = data.messages[i].senderName;

    if (data.messages[i].fromMe) {
      logger.log('fromMe!');
    } // return;

    logger.log(author, body, chatId, senderName);
  }

  res.status(200).send();
};
