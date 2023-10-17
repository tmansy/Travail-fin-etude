import { Request, Response, NextFunction } from "express";
import async from 'async';
import { User } from "../domain/user";
import { Op } from "sequelize";
import { colorConsole } from "tracer";
import { User_team } from "../domain/user_team";

const logger = colorConsole();

export const UsersControllers = {
    getUserInfos: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const userId = res.locals.focus;
            let user: User;

            let userInstance = database['Users'].findOne({
                where: {
                    id: userId,
                }
            });

            user = User.createFromDB(userInstance);

            res.locals.response = user;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    putUserInfos: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const userId = res.locals.focus;
            const user = User.createFromBody(req.body);

            await database['Users'].update(user, {
                where: {
                    id: userId,
                }
            });

            const _user = await database['Users'].findOne({
                where: {
                    id: userId,
                }
            })

            res.locals.response = _user;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    getTeamsByPlayerId: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const userId = res.locals.focus;

            let user_teams = await database['Users_Teams'].findAll({
                where: {
                    userId: userId,
                },
                include: [
                    { model: database['Users'] },
                    { model: database['Teams'] },
                ],
            });

            user_teams = user_teams.map(ut => User_team.createFromDB(ut.toJSON()));

            const filteredUserTeams = User_team.filterUniqueTeams(user_teams);

            res.locals.response = filteredUserTeams;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    getAllPlayersInformationsByteam: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const teamId = res.locals.focus;

        async.waterfall([
            (callback) => {
                database['Users_Teams'].findAll({
                    where: {
                        teamId: teamId,
                        roleTeam: { [Op.ne]: 'Admin' }
                    },
                    include: [
                        { model: database['Users'], attributes: ['title', 'firstname', 'lastname', 'email', 'username', 'phone', 'birthdate', 'game', 'rank', 'roleGame', 'img', 'description'] },
                    ]
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

    putPlayerInfos: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const userId = res.locals.focus;
        const body = req.body;

        async.waterfall([
            (callback) => {
                database['Users'].update({
                    rank: body.rank,
                    roleGame: body.roleGame,
                }, {
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
                database['Users_Teams'].update({
                    roleTeam: body.roleTeam,
                }, {
                    where: {
                        userId: userId,
                        roleTeam: ['Joueur', 'Coach', 'Capitaine', 'Analyste'],
                    }
                }).then(() => {
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

    getUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;

            const allUsers = await database['Users'].findAll({
                attributes: ['id', 'title', 'firstname', 'lastname', 'email', 'username', 'phone', 'birthdate', 'rank', 'roleGame', 'description'],
                include: [
                    { model: database['Users_Roles'] }
                ]
            });

            res.locals.response = allUsers.map(u => User.createFromDB(u.toJSON()));
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    postPlayer: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const body = req.body;
        let userId;

        async.waterfall([
            (callback) => {
                database['Users'].findOne({
                    where: {
                        username: body.username,
                    }
                }).then((instance) => {
                    if(instance) {
                        userId = instance.id;
                        callback();
                    }
                }).catch((err) => {
                    callback(err);
                })
            },
            (callback) => {
                database['Users_Teams'].create({
                    roleTeam: body.roleTeam,
                    userId: userId,
                    teamId: body.teamId,
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

    postStaff: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const body = req.body;
        let userId;
        let userRoleId;

        async.waterfall([
            (callback) => {
                database['Users'].findOne({
                    where: {
                        username: body.username
                    }
                }).then((instance) => {
                    if(instance) {
                        userId = instance.id;
                        callback();
                    }
                    else {
                        callback();
                    }
                }).catch((err) => {
                    callback(err);
                })
            },
            (callback) => {
                if(body.roleAssos == "Président") userRoleId = 3;
                if(body.roleAssos == "Vice-président") userRoleId = 4;
                if(body.roleAssos == "Secrétaire général") userRoleId = 5;
                if(body.roleAssos == "Trésorier") userRoleId = 6;
                if(body.roleAssos == "Ressources humaines") userRoleId = 7;
                if(body.roleAssos == "Responsable marketing") userRoleId = 8;
                if(body.roleAssos == "Responsable partenariat") userRoleId = 9;
                if(body.roleAssos == "Responsable des équipes") userRoleId = 10;
                if(body.roleAssos == "Responsable régie") userRoleId = 11;

                database['Users_Roles'].create({
                    roleId: userRoleId,
                    userId: userId,
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

    deleteStaff: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const body = req.body;

        async.waterfall([
            (callback) => {
                database['Users_Roles'].destroy({
                    where: {
                        roleId: body.tableRole,
                        userId: body.id,
                    }
                }).then(() => {
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

    getUsersStatus: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;

        async.waterfall([
            (callback) => {
                database['Users'].findAll({
                    attributes: ['username'],
                    include: [
                        { model: database['MembershipRequests'], attributes: ['status'] }
                    ]
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

}