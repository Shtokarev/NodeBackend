/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from 'express';

import logger from '../utils/logger';
import { WhatsAppMessage, botWorker } from '../modules/chatApi/chatBot';


export const chatApiWebhook: RequestHandler = async (req, res) => {
  logger.log('incoming POST on route /chat-api-webhook');

  const { messages }: { messages: WhatsAppMessage[] } = req.body;
  logger.log(JSON.stringify(req.body));

  for (const message of messages) {
    const { author, body, chatId, senderName } = message;

    logger.log(author, body, chatId, senderName);

    if (message.fromMe) {
      logger.log('fromMe!'); // test bot only for myself
    } else {
      return res.status(200).send();
    }

    botWorker(message);
  }

  res.status(200).send();
};
