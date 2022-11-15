import { RequestHandler } from "express";
import logger from "../utils/logger";
import { SitemapStream, streamToPromise } from "sitemap";

const PAGES = [
  {
    isInSitemap: true,
    url: "/casino/test2/",
    updatedAt: "2020-06-29T12:36:22.815Z",
  },
  {
    isInSitemap: true,
    url: "/promotions/coupon_promo_opt_in_true/",
    updatedAt: "2021-01-25T08:28:53.253Z",
  },
  {
    isInSitemap: true,
    url: "/football/japan-j-league-1-/",
    updatedAt: "2020-10-20T06:48:10.305Z",
  },
];

const hostname = "https://example.com";

const localeEn = "en";
const localeEs = "es";
const localeJa = "ja";
const localeZh = "zh";

export const sitemap: RequestHandler = async (req, res) => {
  logger.log("incoming GET on route /sitemap.xml");

  const smStream = new SitemapStream({ hostname });

  PAGES.forEach(({ isInSitemap, url, updatedAt }) => {
    if (isInSitemap) {
      smStream.write({
        url,
        lastmod: updatedAt,
        changefreq: "always",
        priority: 1,
        links: [
          { lang: "x-default", url },
          { lang: localeEn, url: `${localeEn}${url}` },
          { lang: localeEs, url: `${localeEs}${url}` },
          { lang: localeJa, url: `${localeJa}${url}` },
          { lang: localeZh, url: `${localeZh}${url}` },
        ],
      });
    }
  });

  smStream.end();
  const sitemap = await streamToPromise(smStream);

  return res.status(200).send(sitemap.toString());
};
