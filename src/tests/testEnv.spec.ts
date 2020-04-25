
import {
  PORT,
  MONGODB_CONNECTION_STRING,
  REDIS_HOST,
  SENTRY_DSN,
  CORS_ORIGIN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  FB_APP_ID,
  FB_REDIRECT_URI,
  FB_CLIENT_SECRET,
  HTTPS_PORT,
  HTTPS_CERT,
  HTTPS_KEY,
  CHAT_API_URL,
  CHAT_API_TOKEN,
  MEDIA_BUCKET,
  MEDIA_BUCKET_REGION,
  JWT_SECRET_KEY,
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
  it('should have CORS_ORIGIN', () => {
    expect(CORS_ORIGIN).toEqual(jasmine.any(String));
  });
  it('should have GOOGLE_CLIENT_ID', () => {
    expect(GOOGLE_CLIENT_ID).toEqual(jasmine.any(String));
  });
  it('should have GOOGLE_CLIENT_SECRET', () => {
    expect(GOOGLE_CLIENT_SECRET).toEqual(jasmine.any(String));
  });
  it('should have GOOGLE_REDIRECT_URI', () => {
    expect(GOOGLE_REDIRECT_URI).toEqual(jasmine.any(String));
  });
  it('should have FB_APP_ID', () => {
    expect(FB_APP_ID).toEqual(jasmine.any(String));
  });
  it('should have FB_REDIRECT_URI', () => {
    expect(FB_REDIRECT_URI).toEqual(jasmine.any(String));
  });
  it('should have FB_CLIENT_SECRET', () => {
    expect(FB_CLIENT_SECRET).toEqual(jasmine.any(String));
  });
  it('should have HTTPS_PORT', () => {
    expect(HTTPS_PORT).toEqual(jasmine.any(String));
  });
  it('should have HTTPS_CERT', () => {
    expect(HTTPS_CERT).toEqual(jasmine.any(String));
  });
  it('should have HTTPS_KEY', () => {
    expect(HTTPS_KEY).toEqual(jasmine.any(String));
  });
  it('should have CHAT_API_URL', () => {
    expect(CHAT_API_URL).toEqual(jasmine.any(String));
  });
  it('should have CHAT_API_TOKEN', () => {
    expect(CHAT_API_TOKEN).toEqual(jasmine.any(String));
  });
  it('should have MEDIA_BUCKET', () => {
    expect(MEDIA_BUCKET).toEqual(jasmine.any(String));
  });
  it('should have MEDIA_BUCKET_REGION', () => {
    expect(MEDIA_BUCKET_REGION).toEqual(jasmine.any(String));
  });
  it('should have JWT_SECRET_KEY', () => {
    expect(JWT_SECRET_KEY).toEqual(jasmine.any(String));
  });
});