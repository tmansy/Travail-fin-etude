import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";
import { Tournament } from "../domain/tournament";

const logger = colorConsole();

export const TournamentsControllers = {
    getAllTournaments: async(req: Request, res: Response, next: NextFunction) => {
        try {
            let tournaments = await res.locals.database['Tournaments'].findAll();

            tournaments = tournaments.map((tournament) => Tournament.createfromDB(tournament.toJSON()));

            res.locals.response = tournaments;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer tous les tournois'));
        }
    },

    getTournamentWithTeams: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let tournament = await res.locals.database['Tournaments'].findOne({
                where: {
                    id: res.locals.focus,
                },
                include: [
                    { 
                        model: res.locals.database['Teams_Tournaments'],
                        include: [
                            { model: res.locals.database['Teams'] },
                        ]
                    }
                ]
            });

            res.locals.response = tournament;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer les équipes du tournoi'));
        }
    }
}