import { Request, Response, NextFunction } from "express";
import async from 'async';
import bcrypt from 'bcrypt';
import { User } from "../domain/user";
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";

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
                        const passwordMatch = bcrypt.compareSync(password, hashedPassword);
                        if(passwordMatch) {
                            const token = jwt.sign({ userId: instance.id }, `${process.env.SECRET_KEY}`, { expiresIn: '24h' });
                            res.locals.response = {
                                user: instance,
                                token: token,
                            };
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

    signup: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const body = req.body;
        var hashedPassword;

        async.waterfall([
            (callback) => {
                bcrypt.hash(body.password, 10, (err, hash) => {
                    if(err) {
                        callback(err);
                    }
                    else {
                        hashedPassword = hash;
                        callback();
                    }
                })
            },
            (callback) => {
                database['Users'].findAll({
                    where: {
                        [Op.or]: [
                            { username: body.username },
                            { email: body.email }
                        ]
                    }
                }).then((instances) => {
                    if(instances) {
                        res.locals.response = "false";
                        next();
                    }
                    else {
                        callback();
                    }
                }).catch((err) => {
                    callback(err);
                })
            },
            (callback) => {
                database['Users'].create({
                    firstname: body.firstname,
                    lastname: body.lastname,
                    email: body.email,
                    username: body.username,
                    password: hashedPassword,
                    roleId: 1,
                }).then((instance) => {
                    res.locals.response = instance;
                    callback();
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
    }
}