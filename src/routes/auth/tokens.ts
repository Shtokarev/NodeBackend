import { Router } from 'express';
import { singIn } from '../../controllers/auth/sign-in';
import { singUp } from '../../controllers/auth/sign-up';
import { refreshToken } from '../../controllers/auth/refresh-token';
import { mwCheckUniqueEmail } from '../../middlewares/checkUniqueEmail';

const tokens = (router: Router) => {
  router.post('/sign-in', singIn);
  router.post('/sign-up', mwCheckUniqueEmail, singUp);
  router.post('/refresh-token', refreshToken);

  // hardcoded route path
  return '/api/auth';
};

export default tokens;
