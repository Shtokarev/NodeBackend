
import {
  PORT,
  REDIS_HOST,
  MONGODB_CONNECTION_STRING,
  SENTRY_DSN,
} from '../utils/env-loader';


describe('Test environment variables', () => {
  it('should have PORT', () => {
    expect(Number.parseInt(PORT, 10)).toEqual(jasmine.any(Number));
  });

  it('should have MONGODB_CONNECTION_STRING', () => {
    expect(MONGODB_CONNECTION_STRING).toEqual(jasmine.any(String));
  });

  it('should have REDIS_HOST', () => {
    expect(REDIS_HOST).toEqual(jasmine.any(String));
  });

  it('should have SENTRY_DSN', () => {
    expect(SENTRY_DSN).toEqual(jasmine.any(String));
  });
});