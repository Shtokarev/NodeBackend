import { Express, Request } from 'express';
import * as Sentry from '@sentry/node';
import { Db } from 'mongodb';
import { DynamoDbObj } from './utils/init-dynamodb';
import { AsyncRedisClient } from './utils/init-redis';

export interface Application extends Express {
  locals: {
    db: Db;
    redis: AsyncRedisClient;
    sentry: typeof Sentry;
    dynamodb: DynamoDbObj;
  };
};

export interface AppConfiguration {
  db?: Db;
  redis?: AsyncRedisClient;
  sentry?: typeof Sentry;
  dynamodb?: DynamoDbObj;
}

export type AppRequest = Request;

export interface ResponseError {
  message: string,
  validationError?: { [name: string]: string },
}

export interface ServerResponse {
  success: boolean;
  error?: ResponseError;
  data?: Record<string, unknown>;
  sentry?: string;
}

export interface ExpressError {
  message: string;
  route: string;
  status: number;
}

export type AccountsType = 'guest' | 'user' | 'admin';

export interface User {
  id: string;
  _id?: string;
  role: AccountsType;
  email: string;
  passwordHash: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  fbId?: string;
  googleId?: string;
}

export interface FacadeResult<T> {
  success: boolean;
  error?: Error;
  result?: T;
}
