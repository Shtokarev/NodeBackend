import { RequestHandler } from 'express';
import { AppRequest, ServerResponse, Tokens } from '../../types';
import { createToken } from '../../utils/create-tokens';
import { createUser } from '../../facades/users';
import logger from '../../utils/logger';
import { getHash } from '../../utils/hash';
import { saveRefreshToken } from '../../facades/tokens';

export const singUp: RequestHandler = async (req: AppRequest, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { role, email, password, fingerprint, pin } = req.body;
  const response = {} as ServerResponse;
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
    delete req.body.pin;
    delete req.body.fingerprint;

    const facadeResult = await createUser(req.body);

    if (!facadeResult.success) {
      response.error = { message: facadeResult.error.message };
      return res.status(500).json(response);
    }

    const profile = facadeResult.result;
    delete profile.passwordHash;

    const accessToken = await createToken(profile.id, profile.email, profile.role);
    const refreshToken = await createToken(profile.id, profile.email, profile.role, true);

    const saveToken: Tokens = {
      type: 'refresh',
      token: refreshToken,
      fingerprint,
      userId: profile.id,
    };
    await saveRefreshToken(saveToken);

    response.data = { profile, accessToken, refreshToken };
    res.status(201).json(response);

  } catch (error) {
    logger.error(error.message);
    response.error = { message: error.message };
    res.status(500).json(response);
  }
};
