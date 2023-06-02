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
                database['Players'].findAll({
                    include: [
                        { model: database['Users'], where: { roleId: 2 } }
                    ]
                }).then((instances) => {
                    admins.push(...instances);
                    callback();
                })
            },
            (callback) => {
                async.each(admins, (admin, nextAdmin) => {
                    database['Players_Teams'].create({
                        playerId: admin.id,
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
    }
}