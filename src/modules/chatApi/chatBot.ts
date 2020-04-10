import { Request, Response } from 'express';
import rp from 'request-promise';

import logger from '../../utils/logger';

import { CHAT_API_URL, CHAT_API_TOKEN } from '../../utils/env-loader';


const apiChatApi = async (method: string, params: any): Promise<Record<string, unknown> | null> => {
  try {
    const uri = `${CHAT_API_URL}/${method}?token=${CHAT_API_TOKEN}`;

    const jsonResponse = await rp({
      method: 'POST',
      json: true,
      body: JSON.stringify(params),
      uri,
    });

    return jsonResponse;
  } catch (err) {
    logger.error(`Facebook signup error: ${err.message}`);
    return null;
  }
};