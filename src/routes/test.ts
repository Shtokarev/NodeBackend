import { Router } from 'express';

import { test } from '../controllers/test';
import { mwCheckAuthToken } from '../middlewares/checkAuthToken';

const testRoute = (router: Router) => {
  router.get('/', mwCheckAuthToken, test);
};

export default testRoute;
