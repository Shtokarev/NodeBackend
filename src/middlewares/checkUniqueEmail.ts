import { RequestHandler } from 'express';
import { AppRequest, ServerResponse } from '../types';
import { getUserByEmail } from '../facades/users';

export const mwCheckUniqueEmail: RequestHandler = async (req: AppRequest, res, next) => {
  const { email } = req.body;
  const response = {} as ServerResponse;

  try {
    const facadeResult = await getUserByEmail(email);

    if (!facadeResult.success) {
      response.error = {
        message: 'Email check error',
        validationError: { email: 'Email check error' }
      };
      return res.status(500).json(response);
    }

    if (facadeResult.result) {
      response.error = {
        message: 'User with this email address already exists',
        validationError: { email: 'User with this email address already exists' }
      };
      return res.status(401).json(response);
    }

    return next();

  } catch (error) {
    response.error = { message: error.message };
    return res.status(500).json(response);
  }
};
