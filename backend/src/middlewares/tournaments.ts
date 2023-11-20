import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";

const logger = colorConsole();

export const TournamentsControllers = {
    getAllTournaments: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const tournaments = await res.locals.database['Tournaments'].findAll();

            res.locals.response = tournaments;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer tous les tournois'));
        }
    }
}