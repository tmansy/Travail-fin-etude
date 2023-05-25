import * as async from 'async';
import * as _ from 'underscore';
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

export const AuthControllers = {
    account: (req: Request, res: Response, next: NextFunction) => {
        const payload = res.locals.session?.payload;

        async.waterfall([
            (callback) => {
                if(payload?.sub?.length > 0) {
                    callback();
                }
                else {
                    next(new Error('Auth.account: It lacks payload !'));
                }
            },
            (callback) => {
                res.locals.database['Users'].findOne({
                    where: {
                        sub: payload.sub,
                    },
                    attributes: [
                        'id',
                        'username',
                        'sub',
                        'admin',
                        'email'
                    ]
                }).then((instance) => {
                    if(_.isObject(instance)) {
                        res.locals.session.user = instance.toJSON();
                        callback();
                    }
                    else {
                        next(new Error('Auth.account: Le token est invalide !'));
                    }
                }).catch((err) => {
                    next(new Error(err));
                })
            }
        ], () => {
            next();
        })
    },

    token: (req: Request, res: Response, next: NextFunction) => {
        var token = req.headers.authorization;
        res.locals.session = res.locals.session || {};

        if(token?.length > 0 && _.isString(token) && token !== "null") {
            if(token.startsWith('bearer') || token.startsWith('Bearer')) {
                token = token.substring(6).trim();
            }
            const decoded = jwt.decode(token, { complete: true });
            res.locals.session.decoded = decoded;
            res.locals.session.payload = decoded && decoded.payload;
            res.locals.session.token = token;
            next();
        }
        else {
            next(new Error('Auth.token: Cette requête est soumise à l\'envoie d\'un token'));
        }   
    }
}