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

    getTeamsByPlayerId: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const playerId = res.locals.focus;

        async.waterfall([
            (callback) => {
                database['Players_Teams'].findAll({
                    where: {
                        playerId: playerId,
                    },
                    include: [
                        { model: database['Players'] },
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
    }
}