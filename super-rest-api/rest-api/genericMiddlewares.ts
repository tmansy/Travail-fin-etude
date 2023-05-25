import { NextFunction, Request, Response } from "express";
import { SequelizeWarning } from "./sequelizeWarning";
import { ValidationErrorItem } from "sequelize";
import { colorConsole } from "tracer";
const logger = colorConsole()
import * as _ from "underscore";
const dir = "./cache";

const Database = require("./buildDatabases");

export const SuperError = (e: any, req: Request, res: Response) => {
  let statusCode = 500;
  let message = [...res.locals.message];

  logger.error(e);

  if (e && e.name === "SequelizeDatabaseError") {
    message.push(e.original.sqlMessage);
    statusCode = 520;
  } else if (e instanceof SequelizeWarning) {
    statusCode = 202;
    message.push(e.message);
  } else if (e instanceof Error) {
    statusCode = 500;
    message.push(e.message);
  } else if (e) {
    statusCode = 500;
    const errors = _.isArray(e.errors) ? e.errors : [];
    errors.map((error: any) => {
      if (error instanceof ValidationErrorItem) {
        message.push(error.message);
      } else {
        logger.log(error);
      }
    });
  }

  const answer = {
    statusCode: statusCode,
    message: message.length > 0 ? message.join(", ") : "no message",
  };

  res.status(statusCode).json(answer);
};


export default {

  
  stop : (req: Request, res: Response) => {
    res.status(200).json(res.locals.response);
  },
  
  socket : (req: any, res: Response, next: NextFunction) => {
    const params = req.query;
    // colog.error("SocketMiddleware "+req.originalUrl)
    if (
      req.app &&
      req.app.io &&
      _.has(params, "socket") &&
      params.socket.length > 0 &&
      params.socket !== "true"
    ) {
      // logger.error(`I will send socket with : `, params.socket, res.response)
      req.app.io.emit(params.socket, res.locals.response);
    }
    next();
  }

}
