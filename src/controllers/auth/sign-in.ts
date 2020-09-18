import { RequestHandler } from 'express';
import { AppRequest, ServerResponse, Tokens } from '../../types';
import { createToken } from '../../utils/create-tokens';
import logger from '../../utils/logger';
import { checkHash } from '../../utils/hash';
import { getUserByEmail } from '../../facades/users';
import { saveRefreshToken } from '../../facades/tokens';

export const singIn: RequestHandler = async (req: AppRequest, res) => {
  logger.log('incoming POST on route /sign-in');
  const response = {} as ServerResponse;

  try {
    const { email, password, fingerprint } = req.body;

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
      throw facadeResult.error || new Error('error in getUserByEmail');
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
