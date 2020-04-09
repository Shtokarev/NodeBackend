import * as Redis from 'redis';
import { promisify } from 'util';

import logger from './logger';

export interface RedisFactoryProps {
  host: string;
}

export interface AsyncRedisClient extends Redis.RedisClient {
  getAsync: (key: string) => Promise<string>;
  setAsync: (key: string, value: string) => Promise<unknown>;
  setexAsync: (key: string, seconds: number, value: string) => Promise<string>;
  saddAsync: (key: string, value: string) => Promise<number>;
  sremAsync: (key: string, value: string) => Promise<number>;
  smembersAsync: (key: string) => Promise<string[]>;
}

let redisClient: AsyncRedisClient;

export async function initRedisClient({ host }: RedisFactoryProps): Promise<AsyncRedisClient> {
  if (redisClient) {
    return redisClient;
  }

  redisClient = Redis.createClient({ host, retry_strategy }) as AsyncRedisClient;

  redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
  redisClient.setAsync = promisify(redisClient.set).bind(redisClient);
  redisClient.setexAsync = promisify(redisClient.setex).bind(redisClient);
  redisClient.saddAsync = promisify(redisClient.sadd).bind(redisClient);
  redisClient.sremAsync = promisify(redisClient.srem).bind(redisClient);
  redisClient.smembersAsync = promisify(redisClient.smembers).bind(redisClient);

  enableRedisAutoReconnect(redisClient);

  logger.log(`redis connected: ${host}`);

  return redisClient;
}

function enableRedisAutoReconnect(client: AsyncRedisClient) {
  if (!client || !client.on) {
    return;
  }

  client.on('error', (error: Redis.RedisError) => {
    logger.error('Redis client error', error.message);
  });
}

function retry_strategy(options: Redis.RetryStrategyOptions) {
  if (options.error && options.error.code === 'ECONNREFUSED') {
    return new Error('The server refused the connection');
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    return new Error('Retry time exhausted');
  }
  if (options.attempt > 10) {
    return undefined;
  }

  return Math.min(options.attempt * 100, 3000);
}