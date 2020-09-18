import { RequestHandler } from 'express';

import { AppRequest, ServerResponse, Tokens } from '../../types';
import { createToken } from '../../utils/create-tokens';
import logger from '../../utils/logger';
import { getUserById } from '../../facades/users';
import {
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken
} from '../../facades/tokens';
import { verifyToken } from '../../utils/create-tokens';

export const refreshToken: RequestHandler = async (req: AppRequest, res) => {
  const response = {} as ServerResponse;
  logger.log('incoming POST on route /refresh-token');

  try {
    const { refreshToken, fingerprint } = req.body;

    if (!refreshToken) {
      response.error = { message: 'No refresh token provided' };
      return res.status(401).json(response);
    }

    const decoded = await verifyToken(refreshToken);

    if (decoded.exp < Date.now()) {
      response.error = { message: 'Expired refresh token' };

      await deleteRefreshToken(refreshToken);
      return res.status(401).json(response);
    }

    const { success, result } = await findRefreshToken(refreshToken);

    if (!success || !result) {
      response.error = { message: 'Refresh token not found' };
      return res.status(401).json(response);
    }

    if (result.fingerprint !== fingerprint) {
      response.error = { message: 'Fingerprint not match' };

      await deleteRefreshToken(refreshToken);
      return res.status(401).json(response);
    }

    const facadeResult = await getUserById(result.userId);
    const profile = facadeResult.result;

    if (!profile) {
      response.error = { message: 'User not found' };
      return res.status(401).json(response);
    }

    const accessToken = await createToken(profile.id, profile.email, profile.role);
    const newRefreshToken = await createToken(profile.id, profile.email, profile.role, true);

    const saveToken: Tokens = {
      type: 'refresh',
      token: newRefreshToken,
      fingerprint,
      userId: profile.id,
    };
    await saveRefreshToken(saveToken);

    response.data = { profile, accessToken, refreshToken: newRefreshToken };
    res.status(201).json(response);

  } catch (error) {
    logger.error(error.message);
    response.error = { message: error.message };
    res.status(500).json(response);
  }
};
