import * as _ from "underscore";
import { NextFunction, Request, Response } from "express";
import { colorConsole } from "tracer";
const logger = colorConsole()

export function SuperSocket(req: Request, res: Response, next: NextFunction) {
    const params = req.query;
    if (res.locals?.io && _.has(params, "socket") && Array.isArray(params.socket) && params.socket.length > 0 && params.socket[0] !== "true") {
        res.locals.io.emit(params.socket, res.locals.response);
    }
    next();
}