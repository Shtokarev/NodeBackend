export const { PORT, MONGODB_CONNECTION_STRING, REDIS_HOST } = process.env;

export interface Environment {
  [name: string]: string;
}

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

console.log('environment variables loaded');

const getEnvironment = async (): Promise<Environment> => {
  // const res: Environment = await new Promise(res => res({
  //   PORT,
  //   REDIS_HOST,
  //   MONGODB_CONNECTION_STRING,
  // }));

  const res: Environment = await Promise.resolve(({
    PORT,
    REDIS_HOST,
    MONGODB_CONNECTION_STRING,
  }));

  return res;
};

export default getEnvironment;