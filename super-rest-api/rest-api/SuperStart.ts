import * as _ from "underscore";
import { NextFunction, Request, Response } from "express";
import { Database } from "./buildDatabases";
import { SequelizeWarning } from "./sequelizeWarning";
import { ValidationErrorItem } from "sequelize";

import { colorConsole } from "tracer";
import { SuperConfiguration } from "./superEnv";
const logger = colorConsole()

const Databases: any = {}

const createDatabase = (locals: any): Database => {

  const group = locals.group
  const entity = locals.entity

  let database: Database

  if (group?.length > 0 && entity?.length > 0) {
    if (Databases[entity] && Databases[entity][group] instanceof Database) {
      logger.trace(`the database ${entity} ${group} already exist :)`)
      database = Databases[entity][group]
    }
    else {
      database = new Database(entity, group)
      Databases[entity] = Databases[entity] || {}
      Databases[entity][group] = database
    }
  }
  else if (entity?.length > 0) {
    if (Databases[entity] && Databases[entity]["local"] instanceof Database) {
      logger.trace(`the database ${entity} "local" already exist :)`)
      database = Databases[entity]["local"]
    }
    else {
      database = new Database(entity)
      Databases[entity] = Databases[entity] || {}
      Databases[entity]["local"] = database
    }
  }
  else {
    if (Databases["root"] && Databases["root"]["global"] instanceof Database) {
      logger.trace(`the database "root" "global" already exist :)`)
      database = Databases["root"]["global"]
    }
    else {
      database = new Database()
      Databases["root"] = Databases["root"] || {}
      Databases["root"]["global"] = database
    }
  }

  return database
}

export function SuperStart(req: Request, res: Response, next: NextFunction) {

  if (!SuperConfiguration.root) {
    throw new Error("Please define a SuperConfiguration.root => Folder to scans data.js (ex : path.join(__dirname,'./dist') ) ")
  }

  res.locals.response = {};
  res.locals.message = [];
  res.locals.body = req.body
  res.locals.query = req.query
  res.locals.headers = req.headers
  res.locals.method = req.method

  const route = String(req.originalUrl);
  const checkRoute = _.isString(route) && route.length > 0;
  if (!checkRoute) {
    next(new Error("Il faut une route pour continuer"));
  } else {
    if( SuperConfiguration.createDatabase ) {
      res.locals.database = createDatabase(res.locals)
    }
    next();
  }

}