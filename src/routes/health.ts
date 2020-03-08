import { Router } from 'express';
import { health } from '../controllers/health';

const healthRoute = (router: Router) => {
  router.get('/', health);
};

export default healthRoute;
