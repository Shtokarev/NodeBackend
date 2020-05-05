import { Application, Router } from 'express';
import fs from 'fs';
import path from 'path';

import logger from '../utils/logger';


const addRoutesFromFolder = async (subFoldersPath: string, app: Application) => {
  const fileList = fs.readdirSync(path.join(__dirname, subFoldersPath));

  for (const fileName of fileList) {
    try {
      const fullPath = path.join(__dirname, subFoldersPath, fileName);

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        await addRoutesFromFolder(path.join(subFoldersPath, fileName) + '/', app);
        continue;
      }

      const filenameParts = fileName.split('.');
      const routeName = filenameParts[0];
      const extension = filenameParts.pop();

      if (!['js', 'ts'].includes(extension) || routeName === 'index') {
        continue;
      }

      const router = Router();

      const routeModule = await import(fullPath);
      const forceRoute = routeModule.default(router);

      // for reassign default file structure path
      const routePath = forceRoute ? forceRoute : `/api${subFoldersPath}${routeName}`;

      app.use(routePath, router);
      logger.log(`add route: ${routePath} (${routeName}.${extension})`);

    } catch (error) {
      logger.log(`Error loading route in ${fileName} ${error}`);
    }
  }
};

export default async (app: Application) => {
  await addRoutesFromFolder('/', app);
};
