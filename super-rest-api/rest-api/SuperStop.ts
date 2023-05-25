import * as _ from "underscore";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import { colorConsole } from "tracer";
import { SequelizeForbidden, SequelizeTeapot, SequelizeWarning } from "./sequelizeWarning";

const logger = colorConsole();


export const SuperErrorHandler = (error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(error);
    }
    else {
        let statusCode = 500;
        let message = [...res.locals.message];
      
        logger.error(error);
      
        // if (err && err.name === "SequelizeDatabaseError") {
        //   message.push(err.original.sqlMessage);
        //   statusCode = 520;
        // } 
        if (error instanceof SequelizeWarning) {
          statusCode = 202;
          message = [ error.message ];
        } 
        else if (error instanceof SequelizeForbidden) {
          statusCode = 403;
          message = [ error.message ];
        } 
        else if (error instanceof SequelizeTeapot) {
          statusCode = 418;
          message = [ error.message ];
        } 
        else if (error instanceof Error) {
          statusCode = 500;
          message.push(error.message);
        } 
        else if (error) {
          statusCode = 500;
        }
      
        const answer = {
          statusCode: statusCode,
          message: message.length > 0 ? message.join(", ") : "Pas de message",
        };
      
        res.status(statusCode).json(answer);
    }
}

export const SuperStop = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.locals.response);
}