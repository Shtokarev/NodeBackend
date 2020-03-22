import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';

import logger from '../../utils/logger';
export { default as User } from './user';
export { default as Token } from './token';
import User from './user';
import Token from './token';

export interface DefinedModels {
  User: typeof User;
  Token: typeof Token;
};

export interface DBSequelize {
  sequelize: Sequelize & {
    models: DefinedModels;
  };
  Sequelize: typeof Sequelize;
}

export const initModels = async (dbSequelize: DBSequelize) => {
  try {
    const fileList = fs.readdirSync(path.join(__dirname));

    for (const filename of fileList) {
      const filenameParts = filename.split('.');
      const modelName = filenameParts[0];
      const extension = filenameParts.pop();

      if (!['js', 'ts'].includes(extension) || modelName === 'index') {
        continue;
      }

      const modelModule = await import(`./${modelName}.${extension}`);
      const { initModel, default: { name } } = modelModule;

      initModel(dbSequelize.sequelize);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dbSequelize as any)[name] = modelModule;

      logger.log(`added sequelize model ${name}: ${`./${modelName}.${extension}`}`);
    }
  } catch (err) {
    logger.log(err);
  }
};
