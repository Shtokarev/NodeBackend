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

export interface TokenPayload {
  id: string;
  email: string;
  role: AccountsType;
  exp: number;
}

export interface AppRequest extends Request {
  user: TokenPayload;
}

export interface ResponseError {
  message: string,
  validationError?: { [name: string]: string },
}

export interface ServerResponse {
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

export type TokensType = 'access' | 'refresh';

export interface Tokens {
  id?: string
  _id?: string;
  token: string;
  fingerprint: string;
  userId: string;
  type: TokensType;
}

export interface FacadeResult<T> {
  success: boolean;
  error?: Error;
  result?: T;
}
