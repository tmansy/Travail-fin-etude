import { NextFunction, Request, Response } from "express";
import * as _ from "underscore";
import * as async from "async";
import { Op } from "sequelize";
import { GenericModel } from "./genericModel";
const logger = require("tracer").colorConsole();

const transFormWhere = (where) => {

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

  const args = ["or", "and", "in", "notIn", "not", "is", "ne", "eq", "lt", "lte", "gt", "gte", "between", "notBetween", "like", "notLike", "substring", "startsWith", "endsWith"];
  if (where === null || where === undefined || where === true || where === false) {
    return where 
  }
  else if (typeof (where) === "object" && !Array.isArray(where)) {
    const obj = {}
    Object.keys(where).map(key => {
      if (args.indexOf(String(key)) >= 0) {
        obj[Op[key]] = transFormWhere(where[key]);
      }
      else {
        obj[key] = transFormWhere(where[key])
      }
    })
    return obj
  }
  else if( Array.isArray(where) ) {
    return where.map( item => {
      return transFormWhere(item) 
    })
  }
  else return where
}

const flushRedis = (table: string, res: Response) => {
  if (res.locals.redisClient) {
    const key = [res.locals.townName, table]
      .filter(
        (x) => x && typeof x === "string" && x !== "undefined" && x.length > 0
      )
      .join("_");
    // logger.info(`TRY TO DELETE FUCKING REDIS KEYS WITH ${key} !`)
    res.locals.redisClient.keys("*", (err: any, keys: any) => {
      // logger.log(keys)
      if (err) return logger.log(err);
      else {
        keys
          .filter((k: string) => k.startsWith(key))
          .map((keyToFlush: string) => {
            res.locals.redisClient.del(keyToFlush);
            logger.info(`DELETE ${keyToFlush} !`);
          });
      }
    });
  }
};

const buildOptions = (req: Request, res: Response) => {

  var params: any = req.query;
  const locals = res.locals

  locals.where = locals.where || {};
  locals.include = locals.include || [];

  var options: any = {
    where: locals.where,
    include: locals.include,
    locals: locals,
    method: req.method,
    simple: {
      where: locals.where,
      include: locals.include,
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
      options.where[params.key] = { [comparator]: value };
    } else if (test.length === 1) {
      options.where[params.key] = test[0];
    } else {
      // pas encore pris en compte
    }
  }
  else if (_.has(params, "key") && _.has(params, "like")) {
    options.where[params.key] = { [Op.like]: params.like };
  }
  else if (_.has(params, "where")) {

    try {
      options.where = JSON.parse(params.where);
    } catch (e) {
      logger.log(e);
    }

    // Il faudrait a terme mettre toutes les opérations et surtout boucler pour voir si jamais c'est pas utilisé partout :)
    if (_.isObject(options.where)) {

      const old_where = options.where
      const new_where = transFormWhere(old_where)
      options.where = new_where

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
    } catch (e) {
      logger.log(e);
    }
  }

  // logger.log(options)

  return options;
};

const _sync = (table: string, req: Request, res: Response, next: NextFunction) => {

  flushRedis(table, res);

  console.log("I TRY TO SYNC !");

  async.waterfall(
    [
      (call: any) => {
        res.locals.database[table]
          .sync({ alter: true })
          .then(() => {
            call(null);
          })
          .catch((err: any) => {
            call(err);
          });
      },
    ],
    (error: any) => {
      if (error) {
        next(error);
      } else {
        next();
      }
    }
  );
};

const _get = (table: string, req: Request, res: Response, next: NextFunction) => {
  const options = buildOptions(req, res);
  var params = req.query;
  var scope = params.scope;

  var redisKey = [res.locals.townName, table, req.originalUrl, JSON.stringify(options.simple)]
    .filter(
      (x) => x && typeof x === "string" && x !== "undefined" && x.length > 0
    )
    .join("_");


  if (_.has(params, "force") && params.force) {
    flushRedis(table, res);
  }

  async.waterfall(
    [
      (call: any) => {
        if (res.locals.redisClient) {
          logger.log(`I TRY TO GET REDIS FROM ${redisKey}`);
          res.locals.redisClient.get(redisKey, (err: any, result: any) => {
            if (err) {
              logger.log(err);
              call(null, false);
            } else {
              try {
                const _res = JSON.parse(result);
                if (
                  (_.isArray(_res) && _res.length > 0) ||
                  (_.isObject(_res) && Object.keys(_res).length > 0)
                ) {
                  logger.log(
                    `I GET THE FUCKING REDIS RESULT FOR ${redisKey} :)`
                  );
                  res.locals.response = _res;
                  call(null, true);
                } else {
                  call(null, false);
                }
              } catch (error) {
                logger.log(error);
                call(null, false);
              }
            }
          });
        } else call(null, false);
      },
      (skip: any, call: any) => {
        if (skip) call(null);
        else {
          // logger.log(options)

          logger.log(`I HAVE TO CALL MYSQL SERVER FOR ${redisKey} :(`);

          const checktable = typeof (res.locals.database[table]) === "function"
          if (checktable) {
            res.locals.database[table]
              .scope(scope)
              .findAll(options)
              .then((instances: Array<any>) => {
                if (Array.isArray(instances)) {
                  res.locals.response = instances;

                  if (_.isArray(res.locals.response)) {
                    const structure: GenericModel = res.locals.database.structures[table];
                    if (_.isObject(structure) && structure.domain) {
                      res.locals.response = res.locals.response.map((instance) => {
                        return new structure.domain(instance.toJSON());
                      });
                    } else {
                      res.locals.response = res.locals.response.map((instance) => {
                        try {
                          const resp = instance.toJSON();
                          return resp;
                        } catch (err) {
                          logger.log(err);
                          return instance.dataValues;
                        }
                      });
                      // logger.log("no domain", res.locals.response)
                    }
                  }
                  if (
                    _.isArray(res.locals.response) &&
                    res.locals.response.length === 1 &&
                    res.locals.focus
                  ) {
                    res.locals.response = _.first(res.locals.response);
                  }

                  // logger.log(res.locals.response)

                  if (res.locals.redisClient) {
                    try {
                      const _res = JSON.stringify(res.locals.response);
                      res.locals.redisClient.setex(redisKey, 3600, _res);
                      logger.log(`I SET RESPONSE IN REDIS ON ${redisKey} :(`);
                    } catch (err) {
                      logger.log(err);
                    }
                  }

                  call(null);
                } else {
                  call("Instances is not an Array");
                }
              })
              .catch((err: any) => {
                call(err);
              });
          }
          else {
            logger.log(res.locals.database[table], typeof (res.locals.database[table]))
            call(`The table ${table} not exists`)
          }
        }
      },
    ],
    (error) => {
      if (error) {
        logger.log(error);
        next(error);
      } else {
        next();
      }
    }
  );
};

const _post = (table: string, req: Request, res: Response, next: NextFunction) => {

  const inputs = req.body;
  const options = buildOptions(req, res)

  flushRedis(table, res);

  async.waterfall(
    [
      (call: any) => {
        if ( !inputs || (Array.isArray(inputs) && inputs.length === 0) || (_.isObject(inputs) && Object.keys(inputs).length === 0) ) {
          return res.status(400).send({
            message: "Body content can not be empty",
          });
        } else {
          call(null);
        }
      },
      (call: any) => {

        if (Array.isArray(inputs)) {

          res.locals.database[table]
            .bulkCreate(inputs, options)
            .then((instances: any) => {
              res.locals.response = instances;
              call(null);
            })
            .catch((err: any) => {
              call(err);
            });

        } 
        else if (_.isObject(inputs)) {

          res.locals.database[table]
            .create(inputs, options)
            .then((instance: any) => {
              if (_.isObject(instance) && instance.dataValues) {
                res.locals.response = instance;
                res.locals.focus = instance.id;
                res.locals.message.push("L'instance a été créée.");
                call(null);
              } else {
                call(
                  "Il y a une erreur de validation qui vous empeche de faire cela !"
                );
              }
            })
            .catch((err: any) => {
              call(err);
            });
            
        } else {
          call(
            "Only Array<object> or Object can be inserted in the table " + table
          );
        }
      },
    ],
    (error) => {
      if (error) {
        next(error);
      } else {
        next();
      }
    }
  );
};

const _put = (table: string, req: Request, res: Response, next: NextFunction) => {

  const inputs = req.body;
  const options = buildOptions(req, res);

  flushRedis(table, res);

  if (!inputs) {
    return res.status(400).send({
      message: "Body content can not be empty",
    });
  } else {
    async.waterfall(
      [
        (call: any) => {

          // On crée un espèce de bulkUpdate (très peu utilisé, c'est amené à disparaitre)
          if (Array.isArray(inputs) && inputs.length > 0) {
            res.locals.where = { id: [] };

            async.each(inputs, (input, cb) => {
              let index = input.id;
              if (index >= 0) {
                // delete input.id
                // _options.returning = true
                // _options.plain = true
                // _options.individualHooks = true
                const _options = _.clone(options);

                _options.where.id = index;
                res.locals.where.id.push(index);

                res.locals.database[table]
                  .update(input, _options)
                  .then(() => {
                    res.locals.message.push("L'instance a été mise à jour.");
                    cb(null);
                  })
                  .catch((err: any) => {
                    call(err);
                  });
              } else {
                cb(null);
              }
            },
              (err) => {
                if (err) call(err);
                else call(null);
              }
            );
          }
          else if (_.isObject(inputs)) {

            if (options.where.id >= 0) {

              res.locals.database[table]
                .update(inputs, options)
                .then((rowsUpdated: any) => {
                  res.locals.database[table]
                    .findAll(options)
                    .then((instance: any) => {
                      if (_.isArray(instance) && instance.length > 1) {
                        const temp: any = [];
                        _.each(instance, (inst) => {
                          temp.push(inst.get());
                        });
                        res.locals.response = temp;
                      } else if (_.isArray(instance) && instance.length === 1) {
                        res.locals.response = instance[0].get();
                      }
                      res.locals.message.push("L'instance a été mise à jour.");
                      call(null);
                    })
                    .catch((e: any) => {
                      // logger.error(e)
                      call(e);
                    });
                })
                .catch((e: any) => {
                  // logger.error(e)
                  call(e);
                });
            } else {
              call();
            }
          }

          // On veut mettre un truc à jour alors qu'on a pas de payload
          else {
            call()
          }
        },
      ],
      (error) => {
        if (error) {
          next(error);
        } else {
          next();
        }
      }
    );
  }
};

const _delete = (table: string, req: Request, res: Response, next: NextFunction) => {

  const options = buildOptions(req, res);

  flushRedis(table, res);

  async.waterfall(
    [
      (call: any) => {

        res.locals.database[table]
          .findOne(options)
          .then((instance: any) => {
            res.locals.response = [];
            if (_.isObject(instance) && instance.dataValues) {
              instance.dataValues.flag = "deleted";
              res.locals.response.push(instance.get());
              res.locals.message.push("L'instance a été supprimée.");
              instance.destroy(options).then(() => {
                call(null);
              })
                .catch((err: any) => {
                  call(err);
                });
            } else call(null);
          })
          .catch((err: any) => {
            call(err);
          });
      },
    ],
    (error) => {
      if (error) {
        next(error);
      } else {
        if (res.locals.focus) {
          res.locals.response = _.first(res.locals.response);
        }
        next();
      }
    }
  );
};

const _count = (table: string, req: Request, res: Response, next: NextFunction) => {

  var options = buildOptions(req, res);

  flushRedis(table, res);

  async.waterfall(
    [
      (call: any) => {
        call(null);
      },
      (call: any) => {
        res.locals.database[table]
          .count(options)
          .then((result: any) => {
            res.locals.response = result;
            call(null);
          })
          .catch((err: any) => {
            call(err);
          });
      },
    ],
    (error) => {
      if (error) {
        next(error);
      } else {
        next();
      }
    }
  );
};

const flush = (table: string, req: Request, res: Response, next: NextFunction) => {
  // table peut être un string ou un array de string
  const doItFor: Array<string> = typeof table === "string" ? [table] : _.isArray(table) ? table : [];
  doItFor.map((it: string) => {
    flushRedis(it, res);
  });
  next();
};

const _where = (options: any = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let temp = {};

    function build_Values(_obj: any, parent: any = null) {
      if (!parent) parent = temp;

      if (_.isObject(_obj)) {
        _.each(_obj, (val, key) => {
          var _key: any = build_Key(key);
          if (
            key === "accountId" &&
            val === "mine" &&
            _.isNumber(res.locals.session.accountId)
          ) {
            parent["accountId"] = res.locals.session.accountId;
          } else if (_.isString(val) || _.isNumber(val)) {
            parent[_key] = val;
          } else if (_.isObject(val)) {
            parent[_key] = parent[_key] || {};
            build_Values(val, parent[_key]);
          }
        });
      }
    }

    function build_Key(key: string) {
      if (key === "or") return Op.or;
      else if (key === "and") return Op.and;
      else if (key === "lte") return Op.lte;
      else if (key === "gte") return Op.gte;
      else if (key === "lt") return Op.lt;
      else if (key === "gt") return Op.gt;
      else if (_.isString(key)) return key;
      else return false;
    }

    res.locals.where = res.locals.where || {};
    build_Values(options);
    res.locals.where = temp;
    next();
  };
};

const _include = (model: string, as: any = null) => {
  // En deuxieme argument, on peut mettre des as si on a plusieurs associations sur la même table
  // Generic.include("Budgets", ["Id", "Article", "Projet"]),

  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.include = res.locals.include || [];
    if (_.isObject(res.locals.database[model])) {
      if (_.isArray(as) && as.length > 0) {
        // res.locals.include = as
        as.map((_as) => {
          res.locals.include.push({ model: res.locals.database[model], as: _as });
        });
      } else {
        res.locals.include.push({ model: res.locals.database[model] });
      }
    }
    next();
  };
};

export const GenericMethods = {
  get: _get,
  post: _post,
  delete: _delete,
  put: _put,
  sync: _sync,
  count: _count,
  where: _where,
  include: _include,
  buildOptions: buildOptions,
  flushRedis: flushRedis,
  flush: flush,
  transformWhere : transFormWhere, 
};
