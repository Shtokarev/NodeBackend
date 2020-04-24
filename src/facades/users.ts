import { Collection } from 'mongodb';

import logger from '../utils/logger';
import { getApplication } from '../app';
import { User, FacadeResult } from '../types';

const application = getApplication();

export const getUserByEmail = (email: string): Promise<FacadeResult<User>> => {
  return getUser({ email });
};

export const getUser = async (matchObj: Partial<User>): Promise<FacadeResult<User>> => {
  const result = { success: true } as FacadeResult<User>;

  // mongodb version
  try {
    const users: Collection = application.locals.db.collection('Users');
    result.result = await users.findOne(matchObj);

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

export const createUser = async (user: User): Promise<FacadeResult<User>> => {
  const result = { success: true } as FacadeResult<User>;

  // mongodb version
  try {
    const users: Collection = application.locals.db.collection('Users');
    const response = await users.insertOne(user);

    if (!response.result.ok) {
      throw new Error(response.result.toString());
    }

    result.result = response.ops[0];

    // fix id name for all db systems
    result.result.id = result.result._id;
    delete result.result._id;

  } catch (error) {
    logger.error(error);
    result.success = false;
    result.error = error;
  }

  return result;
};