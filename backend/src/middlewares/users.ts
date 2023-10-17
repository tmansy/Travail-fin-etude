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

    getAllPlayersInformationsByteam: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const teamId = res.locals.focus;

            const allPlayers = await database['Users_Teams'].findAll({
                where: {
                    teamId: teamId,
                    roleTeam: { [Op.ne]: 0 }
                },
                include: [
                    { model: database['Users'] },
                ]
            });

            res.locals.response = allPlayers.map(p => User_team.createFromDB(p.toJSON()));
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    putPlayerInfos: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const userId = res.locals.focus;
            const body = req.body;

            await database['Users'].update({
                rank: body.rank,
                roleGame: body.roleGame,
            },
            {
                where: {
                    id: userId,
                }
            });

            await database['Users_Teams'].update({
                roleTeam: body.roleTeam,
            },
            {
                where: {
                    userId: userId,
                    roleTeam: [1, 2, 3, 4, 5],
                }
            });

            res.locals.response = "Le joueur a bien été update";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
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

    postPlayer: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const body = req.body;

            const user = await database['Users'].findOne({
                where: {
                    username: body.username
                }
            });

            const user_team = await database['Users_Teams'].create({
                roleTeam: body.roleTeam,
                userId: user.id,
                teamId: body.teamId,
            });

            res.locals.response = user_team;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    postStaff: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const body = req.body;
            let userRoleId;

            if(body.roleAssos == "Président") userRoleId = 3;
            if(body.roleAssos == "Vice-président") userRoleId = 4;
            if(body.roleAssos == "Secrétaire général") userRoleId = 5;
            if(body.roleAssos == "Trésorier") userRoleId = 6;
            if(body.roleAssos == "Ressources humaines") userRoleId = 7;
            if(body.roleAssos == "Responsable marketing") userRoleId = 8;
            if(body.roleAssos == "Responsable partenariat") userRoleId = 9;
            if(body.roleAssos == "Responsable des équipes") userRoleId = 10;
            if(body.roleAssos == "Responsable régie") userRoleId = 11;

            const user = await database['Users'].findOne({
                where: {
                    username: body.username,
                },
                attributes: ['id'],
            });

            await database['Users_Roles'].create({
                roleId: userRoleId,
                userId: user.id,
            });

            res.locals.response = "Le membre a été ajouté au staff";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    deleteStaff: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const body = req.body;

            await database['Users_Roles'].destroy({
                where: {
                    roleId: body.tableRole,
                    userId: body.id,
                }
            });

            res.locals.response = "Le membre a été retiré du staff";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    getUsersStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;

            const allUsers = await database['Users'].findAll({
                attributes: ['username'],
                include: [
                    { 
                        model: database['MembershipRequests'], 
                        attributes: ['status'] 
                    }
                ]
            });

            res.locals.response = allUsers.map(u => User.createFromDB(u.toJSON()));
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

}