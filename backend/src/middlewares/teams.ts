import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";
import { Team } from "../domain/team";

const logger = colorConsole();

export const TeamsControllers = {
    postNewTeam: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const teamBody = Team.createFromBody(req.body);
            const roleIds = [2, 3, 4];

            const team = await database['Teams'].create(teamBody);

            const usersAdmin = await database['Users'].findAll({
                include: [
                    {
                        model: database['Users_Roles'],
                        where: {
                            roleId: roleIds,
                        }
                    }
                ]
            });

            const userAdminData = usersAdmin.map(user => ({
                userId: user.id,
                teamId: team.id,
                roleTeam: 2,
            }));

            await database['Users_Teams'].bulkCreate(userAdminData);

            res.locals.response = "L'équipe a bien été créée";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error("Impossible de créer l'équipe"));
        }
    },

    putTeamInfos: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const teamId = res.locals.focus;
            const body = req.body;

            await database['Teams'].update(body, {
                where: {
                    id: teamId,
                }
            });

            res.locals.response = "L'équipe a bien été mise à jour";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error("Impossible d'enregistrer les informations de l'équipe"));
        }
    }
}