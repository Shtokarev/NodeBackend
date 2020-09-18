/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from 'express';
import rp from 'request-promise';

import logger from '../../utils/logger';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '../../utils/env-loader';

export const googleCallback: RequestHandler = async (req, res) => {
  const { error, code, scope, state } = req.query;

  try {
    if (error) {
      throw new Error(`Google access error ${error}`);
    }

    let stateParamsObj;
    if (state) {
      try {
        stateParamsObj = JSON.parse(state as string);
      } catch (error) {
        logger.error(error);
      }
    }

    const body = {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_REDIRECT_URI,
    };

    const googleOAuth2Response = await rp({
      body,
      json: true,
      method: 'POST',
      uri: 'https://oauth2.googleapis.com/token',
    });

    const { access_token, expires_in, refresh_token, scope, token_type } = googleOAuth2Response;

    const googleUserUnfoResponse = await rp({
      method: 'GET',
      uri: 'https://www.googleapis.com/oauth2/v1/userinfo', // ?alt=json',
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
      json: true,
    });

    logger.log('incoming GET on route /auth/google/callback');

    res.json({ code, scope, googleOAuth2Response, googleUserUnfoResponse, state: stateParamsObj });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json(error);
  }
};
