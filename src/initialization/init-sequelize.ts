import { Sequelize, Options } from 'sequelize';

export { DBSequelize } from '../models/sequelize';
import { DBSequelize, initModels } from '../models/sequelize';
import logger from '../utils/logger';
import { SEQUELIZE_CONNECTION_STRING, NODE_ENV } from '../utils/env-loader';


interface SequelizeFactoryProps {
  connectionString: string;
}

let dbSequelize: DBSequelize = null;

export const initSequelizeClient = async ({ connectionString }: SequelizeFactoryProps): Promise<DBSequelize> => {
  if (dbSequelize) {
    return dbSequelize;
  }

  const config = {
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: NODE_ENV === 'development' ? logger.log : null,
    // ssl: true,
    // dialectOptions: {
    //   ssl: true,
    // },
  } as Options;

  try {
    const sequelize = await new Promise<Sequelize>((resolve, reject) => {
      const sequelize = new Sequelize(
        SEQUELIZE_CONNECTION_STRING,
        config,
      );

      if (!sequelize) {
        reject();
      }

      resolve(sequelize);
    });

    dbSequelize = {
      sequelize,
      Sequelize,
    } as DBSequelize;

    await initModels(dbSequelize);

    logger.log(`sequelize connected: ${connectionString}`);
  } catch (error) {
    logger.error(`sequelize initialization error: ${error}`);
  }

  return dbSequelize;
};
