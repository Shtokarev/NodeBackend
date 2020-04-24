import fs from 'fs';
import logger from './logger';

export const {
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
} = process.env;

if (!PORT) {
  throw new Error('PORT environment variable is required.');
}

if (!MONGODB_CONNECTION_STRING) {
  throw new Error(
    'MONGODB_CONNECTION_STRING environment variable is required.'
  );
}

if (!REDIS_HOST) {
  throw new Error('REDIS_HOST environment variable is required.');
}

if (!SENTRY_DSN) {
  throw new Error('SENTRY_DSN environment variable is required.');
}

if (!CORS_ORIGIN) {
  throw new Error('CORS_ORIGIN environment variable is required.');
}

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID environment variable is required.');
}

if (!GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET environment variable is required.');
}

if (!GOOGLE_REDIRECT_URI) {
  throw new Error('GOOGLE_REDIRECT_URI environment variable is required.');
}

if (!FB_APP_ID) {
  throw new Error('FB_APP_ID environment variable is required.');
}

if (!FB_REDIRECT_URI) {
  throw new Error('FB_REDIRECT_URI environment variable is required.');
}

if (!FB_CLIENT_SECRET) {
  throw new Error('FB_CLIENT_SECRET environment variable is required.');
}

if (!CHAT_API_URL) {
  throw new Error('CHAT_API_URL environment variable is required.');
}

if (!CHAT_API_TOKEN) {
  throw new Error('CHAT_API_TOKEN environment variable is required.');
}

if (!MEDIA_BUCKET) {
  throw new Error('MEDIA_BUCKET environment variable is required.');
}

if (!MEDIA_BUCKET_REGION) {
  throw new Error('MEDIA_BUCKET_REGION environment variable is required.');
}

if (!JWT_SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY environment variable is required.');
}

export let key: Buffer;
export let cert: Buffer;

if (HTTPS_PORT) {
  try {
    key = fs.readFileSync(HTTPS_KEY);
    cert = fs.readFileSync(HTTPS_CERT);
  } catch (err) {
    logger.log(err);
  }
}
