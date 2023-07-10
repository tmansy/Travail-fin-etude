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
                next(new Error(err));
            }
            else {
                next();
            }
        })
    },

    postMembershipRequest: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const body = req.body;

        async.waterfall([
            (callback) => {
                database['MembershipRequests'].create({
                    title: body.title,
                    lastname: body.lastname,
                    firstname: body.firstname,
                    username: body.username,
                    birthdate: body.birthdate,
                    phone: body.phone,
                    street: body.street,
                    houseNumber: body.house_number,
                    zip_code: body.zip_code,
                    city: body.city,
                    country: body.country,
                    message: body.message,
                    userId: body.userId,
                    status: "En attente",
                }).then((instance) => {
                    if(instance) {
                        res.locals.response = instance;
                        callback();
                    }
                    else {
                        callback();
                    }
                }).catch((err) => {
                    callback(err);
                })
            }
        ], (err) => {
            if(err) {
                next(new Error(err));
            }
            else {
                next();
            }
        })
    },

    putMembershipRequest: (req: Request, res: Response, next: NextFunction) => {
        
    }
}