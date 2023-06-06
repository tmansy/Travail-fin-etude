import { Request, Response, NextFunction } from "express";
import async from 'async';

export const TeamsControllers = {
    postNewTeam: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const body = req.body;
        let admins = [];
        let teamId;

        async.waterfall([
            (callback) => {
                database['Teams'].create({
                    name: body.name,
                    logo: body.logo,
                    description: body.description,
                }).then((instance) => {
                    teamId = instance.id
                    callback();
                }).catch((err) => {
                    callback(err);
                })
            },
            (callback) => {
                database['Users'].findAll({
                    where: {
                        roleId: 2,
                    }
                }).then((instances) => {
                    console.log(instances);
                    admins.push(...instances);
                    callback();
                })
            },
            (callback) => {
                async.each(admins, (admin, nextAdmin) => {
                    database['Users_Teams'].create({
                        userId: admin.id,
                        teamId: teamId,
                    }).then(() => {
                        nextAdmin();
                    }).catch((err) => {
                        nextAdmin(err);
                    })
                }, () => {
                    callback();
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

    putTeamInfos: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const teamId = res.locals.focus;
        const body = req.body;

        async.waterfall([
            (callback) => {
                database['Teams'].update(body, {
                    where: {
                        id: teamId,
                    }
                }).then(() => {
                    callback();
                }).catch((err) => {
                    callback(err);
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
    }
}