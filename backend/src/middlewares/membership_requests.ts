import { Request, Response, NextFunction } from "express";
import async from 'async';

export const MembershipRequestsControllers = {
    getMembershipRequestByUserId: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const userId = res.locals.focus;

        async.waterfall([
            (callback) => {
                database['MembershipRequests'].findOne({
                    where: {
                        userId: userId,
                    }
                }).then((instance) => {
                    res.locals.response = instance;
                    callback();
                }).catch((err) => {
                    callback(err);
                })
            },
        ], (err) => {
            if(err)  {
                next(err);
            }
            else {
                next();
            }
        })
    }
}