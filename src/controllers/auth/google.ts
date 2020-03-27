/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import rp from 'request-promise';

import logger from '../../utils/logger';
import { CLIENT_ID, CLIENT_SECRET } from '../../utils/env-loader';


export const googleCallback = async (req: Request, res: Response) => {
  const { error, code, scope, state } = req.query;
  try {

    if (error) {
      throw new Error(`Google access error ${error}`);
    }

    let obj;
    if (state) {
      try {
        obj = JSON.parse(state);
      } catch (error) {
        logger.error(error);
      }
      logger.log('state:');
      logger.log(obj);
    }

    const body = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://shtokarev.site:8000/api/auth/google/callback'
    };

    const googleResponse = await rp({
      body,
      json: true,
      method: 'POST',
      uri: 'https://oauth2.googleapis.com/token',
    });

    const { access_token, expires_in, refresh_token, scope, token_type } = googleResponse;

    const googleResponse2 = await rp({
      method: 'GET',
      uri: 'https://www.googleapis.com/oauth2/v1/userinfo', // ?alt=json',
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
      json: true,
    });

    logger.log('incoming GET on route /authgoogle');

    res.json({ code, scope, googleResponse, googleResponse2 });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json(error);
  }
};
