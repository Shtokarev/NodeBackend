import { Router } from 'express';
import { authGoogle } from '../controllers/authgoogle';

const authGoogleRoute = (router: Router) => {
  router.get('/', authGoogle);
};

export default authGoogleRoute;
