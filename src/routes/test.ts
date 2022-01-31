import { Router } from "express";

import { test } from "../controllers/test";
// import { mwCheckAuthToken } from "../middlewares/checkAuthToken";

const testRoute = (router: Router): void => {
  // router.get('/', mwCheckAuthToken, test);
  router.get("/", test);
};

export default testRoute;
