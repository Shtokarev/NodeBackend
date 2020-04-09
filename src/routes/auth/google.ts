import { Router } from 'express';
import { googleCallback } from '../../controllers/auth/google';

const authGoogleRoute = (router: Router) => {
  router.get('/callback', googleCallback);
};

export default authGoogleRoute;
