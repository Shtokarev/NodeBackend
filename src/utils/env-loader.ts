export const { PORT, MONGODB_CONNECTION_STRING, REDIS_HOST, SENTRY_DSN, CORS_ORIGIN } = process.env;

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

console.log('environment variables loaded.');
