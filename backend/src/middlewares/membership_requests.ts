import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";
import { Membership_request } from "../domain/membership_request";
import { sendDiscordNotification } from "../lib/sendDiscordNotification";

const logger = colorConsole();

export const MembershipRequestsControllers = {
    getMembershipRequestByUserId: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const userId = res.locals.focus;
            let membership_request: Membership_request;

            let membershipRequestInstance = await database['MembershipRequests'].findOne({
                where: {
                    userId: userId,
                },
                include: [
                    { model: database['Users'] },
                ],
                order: [['createdAt', 'DESC']],
            });
 
            if(membershipRequestInstance) membership_request = Membership_request.createFromDB(membershipRequestInstance.toJSON());

            res.locals.response = membership_request;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    postMembershipRequest: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const body = req.body;

            const request = Membership_request.createFromBody(body);

            const _request = database['MembershipRequests'].create(request);

            const mesage = `${body.username} s'est affilié. Bienvenue et merci !`;
            sendDiscordNotification(mesage);

            res.locals.response = _request;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    getAllMembershipRequests: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let allMembershipRequests = await res.locals.database['MembershipRequests'].findAll({
                include: [
                    { model: res.locals.database['Users'] },
                ]
            });

            res.locals.response = allMembershipRequests.map(mr => Membership_request.createFromDB(mr.toJSON()));
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },

    deleteRequest: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await res.locals.database['MembershipRequests'].destroy({
                where: {
                    userId: res.locals.focus,
                }
            });

            await res.locals.database['Users_Teams'].destroy({
                where: {
                    userId: res.locals.focus,
                }
            });

            res.locals.response = "L'affiliation a été supprimée";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    }
}