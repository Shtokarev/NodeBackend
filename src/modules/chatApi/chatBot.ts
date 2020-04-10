/* eslint-disable @typescript-eslint/no-explicit-any */
import rp from 'request-promise';

import logger from '../../utils/logger';
import { uploadImage2S3Bucket } from '../aws/aws-upload';
import { getAwsModerationLabels } from '../aws/aws-rekognition';
import { CHAT_API_URL, CHAT_API_TOKEN } from '../../utils/env-loader';

const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;

export interface WhatsAppMessage {
  author: string;
  body: string;
  chatId: string;
  senderName: string;
  fromMe: boolean;
}

const apiChatApi = async (method: string, params: any): Promise<any> => {
  try {
    const uri = `${CHAT_API_URL}/${method}?token=${CHAT_API_TOKEN}`;

    const jsonResponse = await rp({
      uri,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: params,
      json: true,
    });

    return jsonResponse;
  } catch (err) {
    logger.error(`apiChatApi error: ${err.message}`);
  }
};

export const botWorker = async (message: WhatsAppMessage) => {
  const { body, chatId } = message;

  try {
    const matchResult = body.match(imgRegex);

    if (matchResult) {
      const url = matchResult[0];

      const upload = await uploadImage2S3Bucket(url);

      if (upload.success) {
        await apiChatApi('sendMessage', { chatId, body: 'uploaded' });
        const moderationStr = await getAwsModerationLabels(upload.uri).catch(err => err);

        const body = moderationStr ? `AWS Recogngition: ${moderationStr}` : 'AWS Recogngition: pass';

        await apiChatApi('sendMessage', { chatId, body });
      } else {
        await apiChatApi('sendMessage', { chatId, body: upload.error?.message });
      }
    }
  } catch (error) {
    logger.error(`botWorker error: ${error.message}`);
    await apiChatApi('sendMessage', { chatId, body: error.message });
  }
};