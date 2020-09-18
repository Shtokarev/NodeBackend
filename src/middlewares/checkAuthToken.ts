import { RequestHandler } from 'express';
import { AppRequest, ServerResponse } from '../types';
import { verifyToken } from '../utils/create-tokens';

export const mwCheckAuthToken: RequestHandler = async (req: AppRequest, res, next) => {
  const response = {} as ServerResponse;

  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers?.authorization?.split('Bearer ')[1];

    if (!token) {
      response.error = { message: 'No token provided' };
      return res.status(401).json(response);
    }

    const decoded = await verifyToken(token);

    if (decoded.exp < Date.now()) {
      response.error = { message: 'Expired token' };
      return res.status(401).json(response);
    }

    req.user = decoded;
    next();

  } catch (error) {
    response.error = { message: error.message };
    return res.status(403).json(response);
  }
};
