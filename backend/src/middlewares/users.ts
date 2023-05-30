import { Request, Response, NextFunction } from "express";
import async from 'async';
import { User } from "../domain/user";

export const UsersControllers = {
    getUserInfos: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const userId = res.locals.focus;

        async.waterfall([
            (callback) => {
                database['Users'].findOne({
                    where: {
                        id: userId,
                    }
                }).then((instance: User) => {
                    if(instance) {
                        res.locals.response = instance;
                        callback();
                    }
                    else {
                        callback();
                    }
                }).catch((err) => {
                    next(err);
                })
            }
        ], (err) => {
            if(err) {
                next(err);
            }
            else {
                next();
            }
        })
    },
}