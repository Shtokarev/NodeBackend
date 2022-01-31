/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import rp from "request-promise";

import logger from "../utils/logger";
import { ServerResponse } from "../types";

export const test: RequestHandler = async (req, res) => {
  logger.log("incoming GET on route /test");

  // const response: ServerResponse = {
  //   data: { array: ['Hello', 'world', 'response', '!'] },
  // };

  let response = {};

  try {
    response = await rp({
      uri: "https://www.instagram.com/goddivafashion/?__a=1",
      json: true,
    });

    logger.log("--------------------------------------");
    logger.log(response);

    // const thumbnail = await getInstagramThumbnail(
    //   "https://www.instagram.com/tv/Bz0OuOfl_-S/"
    // );
  } catch (err) {
    console.log("--------ERROR");
    console.log(err);
    response = err;
  }

  return res.status(200).json(response);
};
