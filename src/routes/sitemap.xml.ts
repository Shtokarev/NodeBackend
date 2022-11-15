import { Router } from "express";
import { sitemap } from "../controllers/sitemap";

const sitemapRoute = (router: Router): void => {
  router.get("/", sitemap);
};

export default sitemapRoute;
