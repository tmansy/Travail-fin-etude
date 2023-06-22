import { Request, Response, NextFunction } from "express";
import async from 'async';
import { User } from "../domain/user";
import { Op } from "sequelize";

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

    putUserInfos: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const userId = res.locals.focus;
        const body = req.body;

        async.waterfall([
            (callback) => {
                database['Users'].update(body, {
                    where: {
                        id: userId,
                    },
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
                    },
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
                database['Users'].findOne({
                    where: {
                        id: userId,
                    },
                    include: [
                        { model: database['Users_Roles'] }
                    ]
                }).then((instance) => {
                    const _instance = instance.toJSON();
                    const hasRoleId2 = _instance.users_roles.some((userRole) => {
                        return userRole.roleId == 2;
                    })
                    if(hasRoleId2) {
                        database['Users_Teams'].findAll({
                            where: {
                                userId: userId,
                                roleTeam: 'Admin',
                            },
                            include: [
                                { model: database['Users'] },
                                { model: database['Teams'] },
                            ]
                        }).then((instances) => {
                            if(instances) {
                                res.locals.response = instances;
                                next();
                            }
                            else {
                                callback();
                            }
                        }).catch((err) => {
                            callback(err);
                        })
                    }
                    else {
                        callback();
                    }
                }).catch((err) => {
                    callback(err);
                })
            },
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

    getUsers: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;

        async.waterfall([
            (callback) => {
                database['Users'].findAll({
                    attributes: ['id', 'title', 'firstname', 'lastname', 'email', 'username', 'phone', 'birthdate', 'game', 'rank', 'roleGame', 'description'],
                    include: [
                        { model: database['Users_Roles'] }
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
    }

}