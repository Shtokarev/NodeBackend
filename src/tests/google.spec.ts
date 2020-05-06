/* eslint-disable @typescript-eslint/no-explicit-any */
import nock from 'nock';
import request from 'supertest';

import initApp, { killApplicaton } from '../app';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '../utils/env-loader';
import { Application } from '../types';

describe('Google auth callback', () => {
  let app: Application;
  const stateObj = {
    origin: 'someOrigin',
    language: 'en',
  };
  const state = JSON.stringify(stateObj);

  beforeEach(async () => {
    app = await initApp({});
  });

  afterEach(() => killApplicaton());

  it('should invoke Google API routes with a valid parameters', async () => {
    const code = 'AQBZfzddMvPYKL-rskYum';

    const googleOAuth2Response = {
      access_token: 'ya29.a0Ae4lvC1xG1AraKBwfC9lUT',
      expires_in: 3599,
      scope: 'https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email',
      token_type: 'Bearer',
      id_token: 'eyJhbGciOiJSUzI1NiIsIOiJKV1QifQ.eyJ',
    };

    const googleUserUnfoResponse = {
      id: '1014594137658',
      email: 'yuri@gmail.com',
      verified_email: true,
      name: 'Yuri',
      given_name: 'Yuri',
      family_name: 'ShtYurikarev',
      picture: 'https://lh3.googleusercontent.com/a-/AOh14Gjb7wWPTIRSpH7',
      locale: 'ru',
    };

    const expectedResponse = {
      code,
      scope: googleOAuth2Response.scope,
      googleOAuth2Response,
      googleUserUnfoResponse,
      state: stateObj,
    };

    const nockPostGoogleCode = nock('https://oauth2.googleapis.com')
      .post('/token')
      .reply(200, (uri, requestBody: any) => {
        expect(requestBody.client_id).toEqual(GOOGLE_CLIENT_ID);
        expect(requestBody.client_secret).toEqual(GOOGLE_CLIENT_SECRET);
        expect(requestBody.grant_type).toEqual('authorization_code');
        expect(requestBody.redirect_uri).toEqual(GOOGLE_REDIRECT_URI);
        expect(requestBody.code).toEqual(code);
        return googleOAuth2Response;
      });

    const nockGetGoogleUserInfo = nock('https://www.googleapis.com')
      .matchHeader('Authorization', `Bearer ${googleOAuth2Response.access_token}`)
      .get('/oauth2/v1/userinfo')
      .reply(200, () => {
        return googleUserUnfoResponse;
      });

    expect.assertions(10);

    const response = await request(app).get('/api/auth/google/callback').query({ state, code });

    expect(response.status).toBe(200);
    expect(response.body.code).toBe(code);
    expect(response.body).toEqual(expectedResponse);

    expect(nockPostGoogleCode.isDone()).toBe(true);
    expect(nockGetGoogleUserInfo.isDone()).toBe(true);
  });
});
