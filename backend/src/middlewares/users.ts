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

    putUserInfos: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const userId = res.locals.focus;
        const body = req.body;

        async.waterfall([
            (callback) => {
                database['Users'].update(body, {
                    where: {
                        id: userId,
                    }
                }).then(() => {
                    callback();
                }).catch((err) => {
                    callback(err);
                })
            },
            (callback) => {
                database['Users'].findOne({
                    where: {
                        id: userId,
                    }
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
    },

    getTFTPlayers: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;

        async.waterfall([
            (callback) => {
                database['Users'].findAll({
                    where: {
                        game: 'TFT',
                    },
                }).then((instances) => {
                    if(instances) {
                        res.locals.response = instances;
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

    getTeamsByPlayerId: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const userId = res.locals.focus;

        async.waterfall([
            (callback) => {
                database['Users_Teams'].findAll({
                    where: {
                        userId: userId,
                    },
                    include: [
                        { model: database['Users'] },
                        { model: database['Teams'] },
                    ]
                }).then((instances) => {
                    if(instances) {
                        const players_teams = instances;
                        res.locals.response = players_teams;
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

    getAllPlayersInformationsByteam: (req: Request, res: Response, next: NextFunction) => {
        
    }
}