import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../utils/env-loader';
import { TokenPayload } from '../types';

export const TIME_ALIVE_ACCESS_TOKEN = 1000 * 60 * 3; // 3 mins
export const TIME_ALIVE_REFRESH_TOKEN = 1000 * 60 * 60 * 24 * 15; // 15 days

export const createToken =
  async (id: string, email: string, role: string, refreshToken = false): Promise<string> => {
    const expired =
      Date.now() +
      (refreshToken ? TIME_ALIVE_REFRESH_TOKEN : TIME_ALIVE_ACCESS_TOKEN);

    const payload = {
      id,
      email,
      role,
      exp: expired
    };

    return new Promise((resolve, reject) => {
      return jwt.sign(JSON.stringify(payload), JWT_SECRET_KEY, (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      });
    });
  };

export const verifyToken = async (token: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (error, decoded: TokenPayload) => {
      if (error) {
        reject(error);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const decodeToken = (token: string): null | Record<string, unknown> | string => jwt.decode(token);
