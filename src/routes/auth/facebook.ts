import { Router } from 'express';
import { facebookCallback } from '../../controllers/auth/facebook';

const authFacebookRoute = (router: Router) => {
  router.get('/callback', facebookCallback);
};

export default authFacebookRoute;
