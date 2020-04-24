import { Response } from 'express';
import { AppRequest, ServerResponse } from '../../types';
import { createToken } from '../../utils/create-tokens';
import { createUser } from '../../facades/users';
import logger from '../../utils/logger';
import { getHash } from '../../utils/hash';

export const singUp = async (req: AppRequest, res: Response) => {
  const { role, email, password } = req.body;
  const response = { success: false } as ServerResponse;
  logger.log('incoming POST on route /sign-up');

  try {
    if (!role) {
      throw new Error('Role is required');
    }

    if (!email) {
      throw new Error('Email is required');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    req.body.passwordHash = await getHash(password);
    delete req.body.password;

    const facadeResult = await createUser(req.body);

    if (!facadeResult.success) {
      response.error = { message: facadeResult.error.message };
      return res.status(500).json(response);
    }

    const profile = facadeResult.result;
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
