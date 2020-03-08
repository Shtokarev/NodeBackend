import { Router } from 'express';

import { test } from '../controllers/test';

const testRoute = (router: Router) => {
  router.get('/', test);
};

export default testRoute;
