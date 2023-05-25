"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.GenericMethods = void 0;
var _ = __importStar(require("underscore"));
var async = __importStar(require("async"));
var sequelize_1 = require("sequelize");
var logger = require("tracer").colorConsole();
var transFormWhere = function (where) {
    // const test = {
    //   "or": {
    //     "from": {
    //       "gte": "2022-01-30T23:00:00.000Z",
    //       "lte": "2022-02-27T22:59:59.999Z"
    //     },
    //     "to": {
    //       "gte": "2022-01-31T23:00:00.000Z",
    //       "lte": "2022-02-28T22:59:59.999Z"
    //     }
    //   },
    //   "archived": 0
    // }
    var args = ["or", "and", "in", "notIn", "not", "is", "ne", "eq", "lt", "lte", "gt", "gte", "between", "notBetween", "like", "notLike", "substring", "startsWith", "endsWith"];
    if (where === null || where === undefined || where === true || where === false) {
        return where;
    }
    else if (typeof (where) === "object" && !Array.isArray(where)) {
        var obj_1 = {};
        Object.keys(where).map(function (key) {
            if (args.indexOf(String(key)) >= 0) {
                obj_1[sequelize_1.Op[key]] = transFormWhere(where[key]);
            }
            else {
                obj_1[key] = transFormWhere(where[key]);
            }
        });
        return obj_1;
    }
    else if (Array.isArray(where)) {
        return where.map(function (item) {
            return transFormWhere(item);
        });
    }
    else
        return where;
};
var flushRedis = function (table, res) {
    if (res.locals.redisClient) {
        var key_1 = [res.locals.townName, table]
            .filter(function (x) { return x && typeof x === "string" && x !== "undefined" && x.length > 0; })
            .join("_");
        // logger.info(`TRY TO DELETE FUCKING REDIS KEYS WITH ${key} !`)
        res.locals.redisClient.keys("*", function (err, keys) {
            // logger.log(keys)
            if (err)
                return logger.log(err);
            else {
                keys
                    .filter(function (k) { return k.startsWith(key_1); })
                    .map(function (keyToFlush) {
                    res.locals.redisClient.del(keyToFlush);
                    logger.info("DELETE ".concat(keyToFlush, " !"));
                });
            }
        });
    }
};
var buildOptions = function (req, res) {
    var _a, _b;
    var params = req.query;
    var locals = res.locals;
    locals.where = locals.where || {};
    locals.include = locals.include || [];
    var options = {
        where: locals.where,
        include: locals.include,
        locals: locals,
        method: req.method,
        simple: {
            where: locals.where,
            include: locals.include
        }
    };
    if (_.has(locals, "focus") && locals.focus !== null && _.isNumber(+locals.focus) && locals.focus >= 0) {
        options.where.id = +locals.focus;
        options.limit = 1;
    }
    else if (_.has(params, "id") && params.id !== null && _.isNumber(+params.id) && params.id >= 0) {
        options.where.id = +params.id;
        options.limit = 1;
    }
    else if (_.has(params, "ids") && params.ids !== null) {
        options.where.id = JSON.parse(params.ids);
    }
    else if (_.has(params, "key") && _.has(params, "value")) {
        var test = String(params.value).split(":");
        if (test.length > 1) {
            var comparator = test[0];
            var value = test[1];
            options.where[params.key] = (_a = {}, _a[comparator] = value, _a);
        }
        else if (test.length === 1) {
            options.where[params.key] = test[0];
        }
        else {
            // pas encore pris en compte
        }
    }
    else if (_.has(params, "key") && _.has(params, "like")) {
        options.where[params.key] = (_b = {}, _b[sequelize_1.Op.like] = params.like, _b);
    }
    else if (_.has(params, "where")) {
        try {
            options.where = JSON.parse(params.where);
        }
        catch (e) {
            logger.log(e);
        }
        // Il faudrait a terme mettre toutes les opérations et surtout boucler pour voir si jamais c'est pas utilisé partout :)
        if (_.isObject(options.where)) {
            var old_where = options.where;
            var new_where = transFormWhere(old_where);
            options.where = new_where;
        }
    }
    if (_.has(params, "accountId")) {
        options.where.accountId = params.accountId;
    }
    if (_.has(params, "limit")) {
        options.limit = +params.limit;
    }
    if (_.has(params, "offset")) {
        options.offset = +params.offset;
    }
    if (_.has(params, "order")) {
        options.order = [String(params.order).split(":")];
    }
    if (_.has(params, "attributes")) {
        try {
            options.attributes = JSON.parse(params.attributes);
        }
        catch (e) {
            logger.log(e);
        }
    }
    // logger.log(options)
    return options;
};
var _sync = function (table, req, res, next) {
    flushRedis(table, res);
    console.log("I TRY TO SYNC !");
    async.waterfall([
        function (call) {
            res.locals.database[table]
                .sync({ alter: true })
                .then(function () {
                call(null);
            })["catch"](function (err) {
                call(err);
            });
        },
    ], function (error) {
        if (error) {
            next(error);
        }
        else {
            next();
        }
    });
};
var _get = function (table, req, res, next) {
    var options = buildOptions(req, res);
    var params = req.query;
    var scope = params.scope;
    var redisKey = [res.locals.townName, table, req.originalUrl, JSON.stringify(options.simple)]
        .filter(function (x) { return x && typeof x === "string" && x !== "undefined" && x.length > 0; })
        .join("_");
    if (_.has(params, "force") && params.force) {
        flushRedis(table, res);
    }
    async.waterfall([
        function (call) {
            if (res.locals.redisClient) {
                logger.log("I TRY TO GET REDIS FROM ".concat(redisKey));
                res.locals.redisClient.get(redisKey, function (err, result) {
                    if (err) {
                        logger.log(err);
                        call(null, false);
                    }
                    else {
                        try {
                            var _res = JSON.parse(result);
                            if ((_.isArray(_res) && _res.length > 0) ||
                                (_.isObject(_res) && Object.keys(_res).length > 0)) {
                                logger.log("I GET THE FUCKING REDIS RESULT FOR ".concat(redisKey, " :)"));
                                res.locals.response = _res;
                                call(null, true);
                            }
                            else {
                                call(null, false);
                            }
                        }
                        catch (error) {
                            logger.log(error);
                            call(null, false);
                        }
                    }
                });
            }
            else
                call(null, false);
        },
        function (skip, call) {
            if (skip)
                call(null);
            else {
                // logger.log(options)
                logger.log("I HAVE TO CALL MYSQL SERVER FOR ".concat(redisKey, " :("));
                var checktable = typeof (res.locals.database[table]) === "function";
                if (checktable) {
                    res.locals.database[table]
                        .scope(scope)
                        .findAll(options)
                        .then(function (instances) {
                        if (Array.isArray(instances)) {
                            res.locals.response = instances;
                            if (_.isArray(res.locals.response)) {
                                var structure_1 = res.locals.database.structures[table];
                                if (_.isObject(structure_1) && structure_1.domain) {
                                    res.locals.response = res.locals.response.map(function (instance) {
                                        return new structure_1.domain(instance.toJSON());
                                    });
                                }
                                else {
                                    res.locals.response = res.locals.response.map(function (instance) {
                                        try {
                                            var resp = instance.toJSON();
                                            return resp;
                                        }
                                        catch (err) {
                                            logger.log(err);
                                            return instance.dataValues;
                                        }
                                    });
                                    // logger.log("no domain", res.locals.response)
                                }
                            }
                            if (_.isArray(res.locals.response) &&
                                res.locals.response.length === 1 &&
                                res.locals.focus) {
                                res.locals.response = _.first(res.locals.response);
                            }
                            // logger.log(res.locals.response)
                            if (res.locals.redisClient) {
                                try {
                                    var _res = JSON.stringify(res.locals.response);
                                    res.locals.redisClient.setex(redisKey, 3600, _res);
                                    logger.log("I SET RESPONSE IN REDIS ON ".concat(redisKey, " :("));
                                }
                                catch (err) {
                                    logger.log(err);
                                }
                            }
                            call(null);
                        }
                        else {
                            call("Instances is not an Array");
                        }
                    })["catch"](function (err) {
                        call(err);
                    });
                }
                else {
                    logger.log(res.locals.database[table], typeof (res.locals.database[table]));
                    call("The table ".concat(table, " not exists"));
                }
            }
        },
    ], function (error) {
        if (error) {
            logger.log(error);
            next(error);
        }
        else {
            next();
        }
    });
};
var _post = function (table, req, res, next) {
    var inputs = req.body;
    var options = buildOptions(req, res);
    flushRedis(table, res);
    async.waterfall([
        function (call) {
            if (!inputs || (Array.isArray(inputs) && inputs.length === 0) || (_.isObject(inputs) && Object.keys(inputs).length === 0)) {
                return res.status(400).send({
                    message: "Body content can not be empty"
                });
            }
            else {
                call(null);
            }
        },
        function (call) {
            if (Array.isArray(inputs)) {
                res.locals.database[table]
                    .bulkCreate(inputs, options)
                    .then(function (instances) {
                    res.locals.response = instances;
                    call(null);
                })["catch"](function (err) {
                    call(err);
                });
            }
            else if (_.isObject(inputs)) {
                res.locals.database[table]
                    .create(inputs, options)
                    .then(function (instance) {
                    if (_.isObject(instance) && instance.dataValues) {
                        res.locals.response = instance;
                        res.locals.focus = instance.id;
                        res.locals.message.push("L'instance a été créée.");
                        call(null);
                    }
                    else {
                        call("Il y a une erreur de validation qui vous empeche de faire cela !");
                    }
                })["catch"](function (err) {
                    call(err);
                });
            }
            else {
                call("Only Array<object> or Object can be inserted in the table " + table);
            }
        },
    ], function (error) {
        if (error) {
            next(error);
        }
        else {
            next();
        }
    });
};
var _put = function (table, req, res, next) {
    var inputs = req.body;
    var options = buildOptions(req, res);
    flushRedis(table, res);
    if (!inputs) {
        return res.status(400).send({
            message: "Body content can not be empty"
        });
    }
    else {
        async.waterfall([
            function (call) {
                // On crée un espèce de bulkUpdate (très peu utilisé, c'est amené à disparaitre)
                if (Array.isArray(inputs) && inputs.length > 0) {
                    res.locals.where = { id: [] };
                    async.each(inputs, function (input, cb) {
                        var index = input.id;
                        if (index >= 0) {
                            // delete input.id
                            // _options.returning = true
                            // _options.plain = true
                            // _options.individualHooks = true
                            var _options = _.clone(options);
                            _options.where.id = index;
                            res.locals.where.id.push(index);
                            res.locals.database[table]
                                .update(input, _options)
                                .then(function () {
                                res.locals.message.push("L'instance a été mise à jour.");
                                cb(null);
                            })["catch"](function (err) {
                                call(err);
                            });
                        }
                        else {
                            cb(null);
                        }
                    }, function (err) {
                        if (err)
                            call(err);
                        else
                            call(null);
                    });
                }
                else if (_.isObject(inputs)) {
                    if (options.where.id >= 0) {
                        res.locals.database[table]
                            .update(inputs, options)
                            .then(function (rowsUpdated) {
                            res.locals.database[table]
                                .findAll(options)
                                .then(function (instance) {
                                if (_.isArray(instance) && instance.length > 1) {
                                    var temp_1 = [];
                                    _.each(instance, function (inst) {
                                        temp_1.push(inst.get());
                                    });
                                    res.locals.response = temp_1;
                                }
                                else if (_.isArray(instance) && instance.length === 1) {
                                    res.locals.response = instance[0].get();
                                }
                                res.locals.message.push("L'instance a été mise à jour.");
                                call(null);
                            })["catch"](function (e) {
                                // logger.error(e)
                                call(e);
                            });
                        })["catch"](function (e) {
                            // logger.error(e)
                            call(e);
                        });
                    }
                    else {
                        call();
                    }
                }
                // On veut mettre un truc à jour alors qu'on a pas de payload
                else {
                    call();
                }
            },
        ], function (error) {
            if (error) {
                next(error);
            }
            else {
                next();
            }
        });
    }
};
var _delete = function (table, req, res, next) {
    var options = buildOptions(req, res);
    flushRedis(table, res);
    async.waterfall([
        function (call) {
            res.locals.database[table]
                .findOne(options)
                .then(function (instance) {
                res.locals.response = [];
                if (_.isObject(instance) && instance.dataValues) {
                    instance.dataValues.flag = "deleted";
                    res.locals.response.push(instance.get());
                    res.locals.message.push("L'instance a été supprimée.");
                    instance.destroy(options).then(function () {
                        call(null);
                    })["catch"](function (err) {
                        call(err);
                    });
                }
                else
                    call(null);
            })["catch"](function (err) {
                call(err);
            });
        },
    ], function (error) {
        if (error) {
            next(error);
        }
        else {
            if (res.locals.focus) {
                res.locals.response = _.first(res.locals.response);
            }
            next();
        }
    });
};
var _count = function (table, req, res, next) {
    var options = buildOptions(req, res);
    flushRedis(table, res);
    async.waterfall([
        function (call) {
            call(null);
        },
        function (call) {
            res.locals.database[table]
                .count(options)
                .then(function (result) {
                res.locals.response = result;
                call(null);
            })["catch"](function (err) {
                call(err);
            });
        },
    ], function (error) {
        if (error) {
            next(error);
        }
        else {
            next();
        }
    });
};
var flush = function (table, req, res, next) {
    // table peut être un string ou un array de string
    var doItFor = typeof table === "string" ? [table] : _.isArray(table) ? table : [];
    doItFor.map(function (it) {
        flushRedis(it, res);
    });
    next();
};
var _where = function (options) {
    if (options === void 0) { options = {}; }
    return function (req, res, next) {
        var temp = {};
        function build_Values(_obj, parent) {
            if (parent === void 0) { parent = null; }
            if (!parent)
                parent = temp;
            if (_.isObject(_obj)) {
                _.each(_obj, function (val, key) {
                    var _key = build_Key(key);
                    if (key === "accountId" &&
                        val === "mine" &&
                        _.isNumber(res.locals.session.accountId)) {
                        parent["accountId"] = res.locals.session.accountId;
                    }
                    else if (_.isString(val) || _.isNumber(val)) {
                        parent[_key] = val;
                    }
                    else if (_.isObject(val)) {
                        parent[_key] = parent[_key] || {};
                        build_Values(val, parent[_key]);
                    }
                });
            }
        }
        function build_Key(key) {
            if (key === "or")
                return sequelize_1.Op.or;
            else if (key === "and")
                return sequelize_1.Op.and;
            else if (key === "lte")
                return sequelize_1.Op.lte;
            else if (key === "gte")
                return sequelize_1.Op.gte;
            else if (key === "lt")
                return sequelize_1.Op.lt;
            else if (key === "gt")
                return sequelize_1.Op.gt;
            else if (_.isString(key))
                return key;
            else
                return false;
        }
        res.locals.where = res.locals.where || {};
        build_Values(options);
        res.locals.where = temp;
        next();
    };
};
var _include = function (model, as) {
    // En deuxieme argument, on peut mettre des as si on a plusieurs associations sur la même table
    // Generic.include("Budgets", ["Id", "Article", "Projet"]),
    if (as === void 0) { as = null; }
    return function (req, res, next) {
        res.locals.include = res.locals.include || [];
        if (_.isObject(res.locals.database[model])) {
            if (_.isArray(as) && as.length > 0) {
                // res.locals.include = as
                as.map(function (_as) {
                    res.locals.include.push({ model: res.locals.database[model], as: _as });
                });
            }
            else {
                res.locals.include.push({ model: res.locals.database[model] });
            }
        }
        next();
    };
};
exports.GenericMethods = {
    get: _get,
    post: _post,
    "delete": _delete,
    put: _put,
    sync: _sync,
    count: _count,
    where: _where,
    include: _include,
    buildOptions: buildOptions,
    flushRedis: flushRedis,
    flush: flush,
    transformWhere: transFormWhere
};
//# sourceMappingURL=genericMethods.js.map