import { Request, Response, NextFunction } from "express";
import async from 'async';
import { Player } from "../domain/player";

export const PlayersControllers = {
    getTFTPlayers: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;

        async.waterfall([
            (callback) => {
                database['Players'].findAll({
                    where: {
                        game: 'tft',
                    },
                    include: [
                        { model: database['Users'], attributes: ['username'] }
                    ]
                }).then((instances) => {
                    if(instances) {
                        const players: Player = instances;
                        res.locals.response = players;
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
}