const url = require("url");

import { NextFunction, Request, Response } from "express";
import { colorConsole } from "tracer";
const logger = colorConsole()

module.exports = {

  set: (req:Request, res:Response, next:NextFunction) => {
    // logger.log("cacheMiddleware")

    if (req.method.toLowerCase() === "get") {
      res.locals.redisClient.get(req.originalUrl, (err:any, result:any) => {
        if (err) {
          next();
        } else {
          // if key in redis store
          if (result) {
            logger.log("In cache");
            res.locals.response = JSON.parse(result);
            next();
            // res.status(200).json(res.getAnswer());
          } else {
            logger.log("Not yet in cache");

            var end = res.end;

            if (res.statusCode === 200) {
              res.locals.end = (chunk:any, encoding:any) => {
                logger.log("Caching process...");

                res.locals.redisClient.setex(
                  req.originalUrl,
                  3600,
                  JSON.stringify(res.locals.response)
                );

                res.end = end;
                res.end(chunk, encoding);
              };
            } else {
              logger.log("Bad response (not 200)");
            }
            next();
          }
        }
      });
    } else {
      const splittedRoute = req.route.path[0].split("/");
      const parameter = splittedRoute.filter((p:string) => p.startsWith(":"))[0];
      let keyToRemove = [];

      if (parameter) {
        const indexParameter = splittedRoute.findIndex((p:string) => p === parameter);

        if (indexParameter > 0) {
          const splittedUrl = url.parse(req.url).pathname.split("/");
          keyToRemove.push(splittedUrl[indexParameter]);

          if (splittedUrl.length >= indexParameter + 1) {
            keyToRemove.push(splittedUrl[indexParameter + 1]);
          }
        }
      }

      let match = keyToRemove.join("/");
      // logger.error(match)

      res.locals.redisClient.keys("*", function (err:any, keys:any) {
        for (var i = 0, len = keys.length; i < len; i++) {
          if (keys[i].includes(match)) {
            logger.error(`I delete from redis : ${keys[i]}`);
            res.locals.redisClient.del(keys[i]);
          }
        }
      });

      next();
    }
  },

  flush: (module:string) => {
    return (req:Request, res:Response, next:NextFunction) => {
      res.locals.redisClient.keys("*", function (err:any, keys:any) {
        for (var i = 0, len = keys.length; i < len; i++) {
          if (keys[i].includes(module)) {
            logger.error(`I delete from redis : ${keys[i]}`);
            res.locals.redisClient.del(keys[i]);
          }
        }
      });

      next();
    };
  },

  flushAll: (req:Request, res:Response, next:NextFunction) => {
    res.locals.redisClient.keys("*", function (err:any, keys:any) {
      for (var i = 0, len = keys.length; i < len; i++) {
        logger.error(`I delete from redis : ${keys[i]}`);
        res.locals.redisClient.del(keys[i]);
      }
    });

    next();
  },
};
