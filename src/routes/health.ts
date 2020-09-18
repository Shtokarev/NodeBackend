import { Router } from 'express';
import { health } from '../controllers/health';

const healthRoute = (router: Router): void => {
  router.get('/', health);
};

export default healthRoute;
