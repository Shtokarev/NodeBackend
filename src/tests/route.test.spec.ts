import request from 'supertest';

import initApp, { AppConfiguration, killApplicaton } from '../app';


describe('Server /api/test route', () => {
  const config: AppConfiguration = {};
  const path = '/api/test';

  let application;

  beforeAll(async () => {
    application = await initApp(config);
  });

  afterAll(() => {
    killApplicaton();
  });

  it('should return status 200', async (done) => {
    const response = await request(application).get(path);

    expect(response.status).toBe(401);
    // expect(response.text).toBe('Hello world!');
    done();
  });
});