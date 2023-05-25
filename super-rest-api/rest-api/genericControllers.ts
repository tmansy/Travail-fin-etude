import { NextFunction, Request, Response } from "express";
import { GenericMethods } from "./genericMethods";

export function GenericControllers(table:any) {
  return {
    get: (req:Request, res:Response, next:NextFunction) => GenericMethods.get(table, req, res, next),
    sync: (req:Request, res:Response, next:NextFunction) => GenericMethods.sync(table, req, res, next),
    put: (req:Request, res:Response, next:NextFunction) => GenericMethods.put(table, req, res, next),
    post: (req:Request, res:Response, next:NextFunction) => GenericMethods.post(table, req, res, next),
    delete: (req:Request, res:Response, next:NextFunction) => GenericMethods.delete(table, req, res, next),
    count: (req:Request, res:Response, next:NextFunction) => GenericMethods.count(table, req, res, next),
    getHistoric: (req:Request, res:Response, next:NextFunction) => GenericMethods.get(table+"_Historic", req, res, next),
  };
};
