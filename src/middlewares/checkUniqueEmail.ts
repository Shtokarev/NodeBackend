import { Response, NextFunction } from 'express';
import { AppRequest, ServerResponse } from '../types';
import { getUserByEmail } from '../facades/users';

export const mwCheckUniqueEmail = async (req: AppRequest, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const response = { success: false } as ServerResponse;

  try {
    const facadeResult = await getUserByEmail(email);

    if (!facadeResult.success) {
      response.error = { message: 'Email check error' };
      return res.status(500).json(response);
    }

    if (facadeResult.result) {
      response.error = { message: 'User with this email address already exists' };
      return res.status(401).json(response);
    }

    return next();

  } catch (error) {
    response.error = { message: error.message };
    return res.status(500).json(response);
  }
};
