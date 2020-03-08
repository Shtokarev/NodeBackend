import { Application, Router } from 'express';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

const normalizedPath = path.join(__dirname);

export default async (app: Application) => {
  const fileList = fs.readdirSync(normalizedPath);

  for (const filename of fileList) {
    try {
      const filenameParts = filename.split('.');
      const routeName = filenameParts[0];
      const extension = filenameParts.pop();

      if (!['js', 'ts'].includes(extension) || routeName === 'index') {
        continue;
      }

      const router = Router();
      logger.log(`add route: ${`./${routeName}.${extension}`}`);
      const routeModule = await import(`./${routeName}.${extension}`);
      routeModule.default(router);

      app.use(`/${routeName}`, router);
    } catch (error) {
      logger.log(`Error loading route in ${filename} ${error}`);
    }
  }
};
