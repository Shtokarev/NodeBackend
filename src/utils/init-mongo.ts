import { MongoClient, MongoError, Db } from 'mongodb';

import logger from './logger';

export interface MongodbFactoryProps {
  connectionString: string;
}

export const initMongodbClient = async ({ connectionString }: MongodbFactoryProps): Promise<Db> => {
  try {
    const db: Db = await new Promise((resolve, reject) => {
      const mongoClient = new MongoClient(connectionString, {
        useUnifiedTopology: true,
        ignoreUndefined: true,
        appname: 'NodeBackend',
      });

      mongoClient.connect((error: MongoError, client: MongoClient) => {
        if (error) {
          return reject(error);
        }

        process.on('SIGTERM', () => {
          client.close();
        });

        resolve(client.db());
      });
    });

    logger.log(`mongodb connected: ${connectionString}.`);
    return db;

  } catch (error) {
    logger.error(`Error in mongoClient.connect: ${error}`);
    return;
  }
};
