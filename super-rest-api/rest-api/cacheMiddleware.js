"use strict";
exports.__esModule = true;
var url = require("url");
var tracer_1 = require("tracer");
var logger = (0, tracer_1.colorConsole)();
module.exports = {
    set: function (req, res, next) {
        // logger.log("cacheMiddleware")
        if (req.method.toLowerCase() === "get") {
            res.locals.redisClient.get(req.originalUrl, function (err, result) {
                if (err) {
                    next();
                }
                else {
                    // if key in redis store
                    if (result) {
                        logger.log("In cache");
                        res.locals.response = JSON.parse(result);
                        next();
                        // res.status(200).json(res.getAnswer());
                    }
                    else {
                        logger.log("Not yet in cache");
                        var end = res.end;
                        if (res.statusCode === 200) {
                            res.locals.end = function (chunk, encoding) {
                                logger.log("Caching process...");
                                res.locals.redisClient.setex(req.originalUrl, 3600, JSON.stringify(res.locals.response));
                                res.end = end;
                                res.end(chunk, encoding);
                            };
                        }
                        else {
                            logger.log("Bad response (not 200)");
                        }
                        next();
                    }
                }
            });
        }
        else {
            var splittedRoute = req.route.path[0].split("/");
            var parameter_1 = splittedRoute.filter(function (p) { return p.startsWith(":"); })[0];
            var keyToRemove = [];
            if (parameter_1) {
                var indexParameter = splittedRoute.findIndex(function (p) { return p === parameter_1; });
                if (indexParameter > 0) {
                    var splittedUrl = url.parse(req.url).pathname.split("/");
                    keyToRemove.push(splittedUrl[indexParameter]);
                    if (splittedUrl.length >= indexParameter + 1) {
                        keyToRemove.push(splittedUrl[indexParameter + 1]);
                    }
                }
            }
            var match_1 = keyToRemove.join("/");
            // logger.error(match)
            res.locals.redisClient.keys("*", function (err, keys) {
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (keys[i].includes(match_1)) {
                        logger.error("I delete from redis : ".concat(keys[i]));
                        res.locals.redisClient.del(keys[i]);
                    }
                }
            });
            next();
        }
    },
    flush: function (module) {
        return function (req, res, next) {
            res.locals.redisClient.keys("*", function (err, keys) {
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (keys[i].includes(module)) {
                        logger.error("I delete from redis : ".concat(keys[i]));
                        res.locals.redisClient.del(keys[i]);
                    }
                }
            });
            next();
        };
    },
    flushAll: function (req, res, next) {
        res.locals.redisClient.keys("*", function (err, keys) {
            for (var i = 0, len = keys.length; i < len; i++) {
                logger.error("I delete from redis : ".concat(keys[i]));
                res.locals.redisClient.del(keys[i]);
            }
        });
        next();
    }
};
//# sourceMappingURL=cacheMiddleware.js.map