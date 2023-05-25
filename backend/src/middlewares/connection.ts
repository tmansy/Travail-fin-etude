import { Request, Response, NextFunction } from "express";
import async from 'async';
import bcrypt from 'bcrypt';
import { User } from "../domain/user";

export const ConnectionControllers = {
    login: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const username = req.body.username;
        const password = req.body.password;

        async.waterfall([
            (callback) => {
                database['Users'].findOne({
                    where: {
                        username: username,
                    }
                }).then((instance: User) => {
                    if(instance) {
                        const hashedPassword = instance.password;
                        const passwordMatch = bcrypt.compareSync(password, hashedPassword)
                        if(passwordMatch) {
                            res.locals.response = instance;
                            callback();
                        }
                        else {
                            res.locals.response = "false";
                            callback();
                        }
                    }
                    else {
                        res.locals.response = "false";
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
}