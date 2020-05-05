import { Collection, ObjectID } from 'mongodb';

import logger from '../utils/logger';
import { getApplication } from '../app';
import { Tokens, FacadeResult } from '../types';

const MAX_FINGERPRINT_PER_USER = 2; // 10
const application = getApplication();

export const saveRefreshToken = async (newToken: Tokens): Promise<FacadeResult<Tokens>> => {
  const result = { success: true } as FacadeResult<Tokens>;

  // mongodb version
  try {
    const tokens: Collection = application.locals.db.collection('Tokens');

    // user relation must be ObjectID
    if (typeof newToken.userId !== 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newToken.userId = new ObjectID(newToken.userId) as any;
    }

    const matchObj = {
      fingerprint: newToken.fingerprint,
      userId: newToken.userId,
      type: 'refresh',
    };

    const res = await tokens.findOneAndUpdate(
      matchObj,
      { $set: newToken },
      { upsert: true, returnOriginal: false }
    );

    if (!res.ok || !res.value) {
      throw new Error('Mongo findOneAndUpdate returned not ok');
    }

    result.result = res.value;
    delete matchObj.fingerprint;

    const numberFingerprint = await tokens.find(matchObj, {
      projection: { _id: true }
    }).toArray();

    // delete all old fingerprints if the number exceeds the maximum
    if (numberFingerprint.length > MAX_FINGERPRINT_PER_USER) {
      await tokens.deleteMany({
        ...matchObj,
        _id: { $ne: result.result._id }
      });
      logger.log(`Number of refersh tokens exceeded limit for user ${newToken.userId}, cleaning...`);
    };

    // fix id name for all db systems
    if (result.result) {
      result.result.id = result.result._id;
      delete result.result._id;
    }

    return result;

  } catch (error) {
    logger.error(error);
    result.success = false;
    result.error = error;
  }

  return result;
};

export const findRefreshToken = async (token: string): Promise<FacadeResult<Tokens>> => {
  const result = { success: true } as FacadeResult<Tokens>;

  // mongodb version
  try {
    const tokens: Collection = application.locals.db.collection('Tokens');
    result.result = await tokens.findOne({ token });

    // fix id name for all db systems
    if (result.result) {
      result.result.id = result.result._id;
      delete result.result._id;
    }

  } catch (error) {
    logger.error(error);
    result.success = false;
    result.error = error;
  }

  return result;
};

export const deleteRefreshToken = async (token: string) => {

  // mongodb version
  try {
    const tokens: Collection = application.locals.db.collection('Tokens');
    await tokens.deleteOne({ token });

  } catch (error) {
    logger.error(error);
  }
};