/* eslint-disable @typescript-eslint/no-explicit-any */
import nock from 'nock';
import request from 'supertest';

import initApp, { killApplicaton, Application } from '../app';
import { FB_APP_ID, FB_REDIRECT_URI, FB_CLIENT_SECRET } from '../utils/env-loader';

const FB_PAGE_LIMIT = 1;

describe('Facebook auth callback', () => {
  let app: Application;
  const stateObj = {
    origin: 'someOrigin',
    language: 'en',
  };
  const state = JSON.stringify(stateObj);
  const scope = 'public_profile,email,user_friends';

  beforeEach(async () => {
    app = await initApp({});
  });

  afterEach(() => killApplicaton());

  it('should invoke Facebook API routes with a valid parameters', async () => {
    const code = 'AQBZfzddMvPYKL-rskYum';
    const access_token = 'ya29.a0Ae4lvC1xG1AraKBwfC9lUT';

    const fBfriendsResponse1 = {
      data: [{ name: 'Yuri', id: '1060662' }],
      paging: {
        cursors: {
          after: 'QVFIUlpCRVZ'
        },
        next: 'https://graph.facebook.com/v6.0/73554'
      },
      summary: { total_count: 3 }
    };

    const fBfriendsResponse2 = {
      data: [{ name: 'Max', id: '10643662' }],
      paging: {
        cursors: {
          after: 'QVFIUlpCRVZ'
        },
      },
      summary: { total_count: 3 }
    };

    const facebookUserUnfoResponse = {
      id: '73555368',
      name: 'Yuri',
      email: 'yurishv@gmail.com',
    };

    const expectedResponse = {
      code,
      scope,
      access_token,
      result: facebookUserUnfoResponse,
      query: stateObj,
      friendsArray: [{ name: 'Yuri', id: '1060662' }, { name: 'Max', id: '10643662' }]
    };

    const nockGetFacebookCode = nock('https://graph.facebook.com')
      .get(`/v6.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${FB_REDIRECT_URI}&client_secret=${FB_CLIENT_SECRET}&code=${code}`)
      .reply(200, () => ({ access_token }));

    const nockGetFacebookUserInfo = nock('https://graph.facebook.com')
      .get(`/v6.0/me?access_token=${access_token}&fields=id,name,email`)
      .reply(200, () => {
        return facebookUserUnfoResponse;
      });

    const nockGetFacebookFriends1 = nock('https://graph.facebook.com')
      .get(`/v6.0/${facebookUserUnfoResponse.id}/friends?access_token=${access_token}&summary=total_count&limit=${FB_PAGE_LIMIT}`)
      .reply(200, () => fBfriendsResponse1);

    const nockGetFacebookFriends2 = nock('https://graph.facebook.com')
      .get(`/v6.0/${facebookUserUnfoResponse.id}/friends?access_token=${access_token}&summary=total_count&limit=${FB_PAGE_LIMIT}&after=QVFIUlpCRVZ`)
      .reply(200, () => fBfriendsResponse2);

    expect.assertions(7);

    const response = await request(app).get('/api/auth/facebook/callback').query({ code, state, scope });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(code);
    expect(response.body).toEqual(expectedResponse);

    expect(nockGetFacebookCode.isDone()).toBe(true);
    expect(nockGetFacebookUserInfo.isDone()).toBe(true);
    expect(nockGetFacebookFriends1.isDone()).toBe(true);
    expect(nockGetFacebookFriends2.isDone()).toBe(true);
  });
});
