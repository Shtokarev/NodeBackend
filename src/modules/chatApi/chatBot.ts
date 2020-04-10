import { Request, Response } from 'express';
import rp from 'request-promise';

import logger from '../../utils/logger';

import { CHAT_API_URL, CHAT_API_TOKEN } from '../../utils/env-loader';

type FileType = 'pdf' | 'jpg' | 'doc' | 'mp3';

export interface WhatsAppMessage {
  author: string;
  body: string;
  chatId: string;
  senderName: string;
  fromMe: boolean;
}

const apiChatApi = async (method: string, params: any): Promise<Record<string, unknown>> => {
  try {
    const uri = `${CHAT_API_URL}/${method}?token=${CHAT_API_TOKEN}`;

    const jsonResponse = await rp({
      uri,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: params, // JSON.stringify(params),
      json: true,
    });

    return jsonResponse;
  } catch (err) {
    logger.error(`apiChatApi error: ${err.message}`);
  }
};

export const botWorker = async (message: WhatsAppMessage) => {
  try {
    const { author, body, chatId, senderName } = message;

    if (/help/.test(body)) {
      logger.log('Этот участок сработает, когда юзер введёт help');

      const text = `${senderName}, это демо-бот для https://chat-api.com/.
          Команды:
          1. chatId - отобразить ID текущего чата
          2. file [pdf/jpg/doc/mp3] - получить файл
          3. ptt - получить голосовое сообщение
          4. geo - получить локацию
          5. group - создать группу с Вами и ботом`;

      await apiChatApi('sendMessage', { chatId: chatId, body: text });

    } else if (/chatId/.test(body)) {
      logger.log('Этот участок сработает, когда юзер введёт chatId');

      await apiChatApi('sendMessage', { chatId: chatId, body: chatId });

    } else if (/file (pdf|jpg|doc|mp3)/.test(body)) {
      logger.log('Этот участок сработает, когда юзер введёт file pdf, file jpg, etc');
      const fileType = body.match(/file (pdf|jpg|doc|mp3)/)[1] as FileType;
      const files = {
        doc: 'http://dl.stk-servers.ru/tra.docx',
        jpg: 'http://dl.stk-servers.ru/tra.jpg',
        mp3: 'http://dl.stk-servers.ru/tra.mp3',
        pdf: 'http://dl.stk-servers.ru/tra.pdf'
      };
      const dataFile = {
        phone: author,
        body: files[fileType],
        filename: `Файл *.${fileType}`
      } as any;

      if (fileType === 'jpg') {
        dataFile.caption = 'Текст под фото.';
      }

      await apiChatApi('sendFile', dataFile);

    } else if (/ptt/.test(body)) {
      logger.log('Этот участок сработает, когда юзер введёт ptt');

      await apiChatApi('sendAudio', {
        audio: 'http://dl.stk-servers.ru/tra.ogg', chatId: chatId
      });

    } else if (/geo/.test(body)) {
      logger.log('Этот участок сработает, когда юзер введёт geo');

      await apiChatApi('sendLocation', {
        lat: 51.178843, lng: -1.826210, address: 'Стоунхендж', chatId: chatId
      });

    } else if (/group/.test(body)) {
      logger.log('Этот участок сработает, когда юзер введёт group');
      const arrayPhones = [author.replace('@c.us', '')];

      await apiChatApi('group', {
        groupName: 'Группа с ботом на Node.JS', phones: arrayPhones, messageText: 'Добро пожаловать в новую группу!'
      });
    } else {
      logger.log('Error');
    }

  } catch (err) {
    logger.error(`botWorker error: ${err.message}`);
  }
};