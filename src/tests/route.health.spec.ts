import request from 'supertest';

import initApp, { killApplicaton } from '../app';


describe('Server /api/health route', () => {
  let db;
  let redis;
  let dynamodb;
  let result;
  let application;
  const path = '/api/health';

  beforeAll(async () => {
    result = {
      express: 'ok',
      mongodb: 'ok',
      redis: 'ok',
      dynamodb: 'ok',
    };

    db = {
      stats: () => Promise.resolve(),
    };

    redis = {
      ping: () => Promise.resolve(true),
    };

    dynamodb = {
      db: {
        listTables: (opt, cb) => cb(),
      }
    };

    application = await initApp({ db, redis, dynamodb });
  });

  afterAll(() => {
    killApplicaton();
  });

  it('should return status 200 if all ok', async (done) => {
    const response = await request(application).get(path);

    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toEqual(result);
    done();
  });

  it('should return status 500 and specified error if mongo db is not working', async (done) => {
    const spyOnStats = spyOn(db, 'stats').and.callFake(() => Promise.reject(new Error('error')));
    result = {
      express: 'ok',
      mongodb: 'error',
      redis: 'ok',
      dynamodb: 'ok',
    };

    const response = await request(application).get(path);

    expect(spyOnStats).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(JSON.parse(response.text)).toEqual(result);
    done();
  });

  it('should return status 500 and specified error if redis is not working', async (done) => {
    const spyOnStats = spyOn(redis, 'ping').and.callFake(() => Promise.reject(new Error('error')));
    result = {
      express: 'ok',
      mongodb: 'ok',
      redis: 'error',
      dynamodb: 'ok',
    };

    const response = await request(application).get(path);

    expect(spyOnStats).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(JSON.parse(response.text)).toEqual(result);
    done();
  });

  it('should return status 500 and specified error if redis.ping not respond', async (done) => {
    const spyOnStats = spyOn(redis, 'ping').and.callFake(() => Promise.resolve(false));
    result = {
      express: 'ok',
      mongodb: 'ok',
      redis: 'no pong received from redis',
      dynamodb: 'ok',
    };

    const response = await request(application).get(path);

    expect(spyOnStats).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(JSON.parse(response.text)).toEqual(result);
    done();
  });

  it('should return status 500 and specified error if DynamoDB is not working', async (done) => {
    const spyOnStats = spyOn(dynamodb.db, 'listTables').and.callFake((opt, cb) => cb(new Error('DynamoDb error')));
    result = {
      express: 'ok',
      mongodb: 'ok',
      redis: 'ok',
      dynamodb: 'DynamoDb error',
    };

    const response = await request(application).get(path);

    expect(spyOnStats).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(JSON.parse(response.text)).toEqual(result);
    done();
  });
});