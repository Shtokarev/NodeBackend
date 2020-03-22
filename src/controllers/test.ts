/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';

import logger from '../utils/logger';
import { getApplication } from '../app';


const application = getApplication();

export const test = async (req: Request, res: Response) => {
  const db = application.locals.dbSequelize.sequelize;

  try {

    const user = await db.models.User.findByPk(1, {
      include:
        [{
          model: db.models.Token,
          as: 'tokens'
        }]
    });
    console.log(user.tokens);

    const token = await db.models.Token.findByPk(1);
    console.log(await user.getTokens());
    console.log(await user.hasTokens(token));
    console.log(await user.countTokens());
    await user.createToken({
      jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZXhhbXBsZS5jb20iLCJzY3JlZW5OYW1lIjoiRGVtb1VzZXIiLCJleHBpcmVkIjoxNTg0ODc5MDAwMDAwfQ.hUQsMm4ijbzRJqFpU2foBHBbaIjFyXGlBSrHtKD2Svs',
      expired: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });


    res.json(user);
    // res.send('Hello world!');
    // throw new Error('test error');
  } catch (error) {
    logger.log(error);
    throw error;
  }
};
