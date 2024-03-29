import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";
import { Membership_request } from "../domain/membership_request";

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
                }
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

            res.locals.response = _request;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },
}