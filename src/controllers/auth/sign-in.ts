import { Response } from 'express';
import { AppRequest, ServerResponse } from '../../types';
import { createToken } from '../../utils/create-tokens';
import logger from '../../utils/logger';
import { checkHash } from '../../utils/hash';
import { getUserByEmail } from '../../facades/users';

export const singIn = async (req: AppRequest, res: Response) => {
  const response = { success: false } as ServerResponse;

  try {
    const { email, password } = req.body;

    if (!email) {
      response.error = {
        message: 'No email provided',
        validationError: { email: 'No email provided' }
      };
      return res.status(401).json(response);
    }

    if (!password) {
      response.error = {
        message: 'No password provided',
        validationError: { password: 'No password provided' }
      };
      return res.status(401).json(response);
    }

    const facadeResult = await getUserByEmail(email);

    if (!facadeResult.success) {
      throw new Error();
    }

    const profile = facadeResult.result;

    if (!profile) {
      response.error = {
        message: 'Email not found',
        validationError: { email: 'Email not found' }
      };
      return res.status(404).json(response);
    }

    const isPassValid = await checkHash(req.body.password, profile.passwordHash);
    if (!isPassValid) {
      response.error = {
        message: 'Wrong password',
        validationError: { password: 'Wrong password' }
      };

      return res.status(401).json(response);
    }

    delete profile.passwordHash;

    const accessToken = await createToken(profile.id, profile.email, profile.role);
    const refreshToken = await createToken(profile.id, profile.email, profile.role, true);
    response.data = { profile, accessToken, refreshToken };
    response.success = true;

    res.status(201).json(response);

  } catch (error) {
    logger.error(error.message);
    response.error = { message: error.message };
    res.status(500).json(response);
  }
};
