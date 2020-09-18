import { RequestHandler } from 'express';
import rp from 'request-promise';

import logger from '../../utils/logger';
import { FB_APP_ID, FB_REDIRECT_URI, FB_CLIENT_SECRET } from '../../utils/env-loader';

const FB_PAGE_LIMIT = 1;

export const facebookCallback: RequestHandler = async (req, res) => {
  const { error, code, scope, state } = req.query;

  try {
    if (error) {
      throw new Error(`Facebook access error code: ${code}, error: ${error}`);
    }

    let uri = new URL(`https://graph.facebook.com/v6.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${FB_REDIRECT_URI}&client_secret=${FB_CLIENT_SECRET}&code=${code}`).href;
    const { access_token } = await rp({
      json: true,
      uri,
    });

    let profile;
    const friendsArray = [];

    try {
      uri = new URL(`https://graph.facebook.com/v6.0/me?access_token=${access_token}&fields=id,name,email`).href;
      profile = await rp({
        json: true,
        uri,
      });

      let afterCursor = '';
      let next;

      do {
        uri = new URL(`https://graph.facebook.com/v6.0/${profile?.id}/friends?access_token=${access_token}&summary=total_count&limit=${FB_PAGE_LIMIT}${afterCursor}`).href;
        const friendsData = await rp({
          json: true,
          uri,
        });

        friendsArray.push(...friendsData.data);

        const { paging: { cursors: { after } } } = friendsData;
        next = friendsData.paging.next;
        afterCursor = `&after=${after}`;

      } while (next);

    } catch (err) {
      logger.log(err.message);
    }

    let query;

    try {
      query = JSON.parse(state as string);

      if (!query) {
        throw new Error('no query (state) params');
      }
    } catch (err) {
      logger.error(`Facebook signup error: ${err.message}`);
    }

    logger.log('incoming GET on route /auth/facebock/callback');

    res.json({ code, scope, access_token, result: profile, query, friendsArray });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json(error);
  }
};
