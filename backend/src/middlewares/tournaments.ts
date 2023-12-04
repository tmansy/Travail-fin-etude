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
    },

    getNotRegistredTeams: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let teams = await res.locals.database['Teams'].findAll({
                attributes: ['id', 'name'],
            });

            let teams_tournament = await res.locals.database['Teams_Tournaments'].findAll({
                where: {
                    tournamentId: res.locals.focus,
                },
                attributes: ['teamId'],
            });

            teams = teams.map((x) => x.toJSON());
            teams_tournament = teams_tournament.map((x) => x.toJSON());

            const teamsNotRegistered = teams.filter((team) => {
                return !teams_tournament.some((registeredTeam) => registeredTeam.teamId === team.id);
            });

            res.locals.response = teamsNotRegistered;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer les équipes qui ne sont pas inscrites au tournoi'));
        }
    },

    registerNewTeam: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { teamName } = req.body;

            let team = await res.locals.database['Teams'].findOne({
                where: {
                    name: teamName,
                },
                attributes: ['id'],
            });

            team = team.toJSON();

            await res.locals.database['Teams_Tournaments'].create({
                tournamentId: res.locals.focus,
                teamId: team.id,
            });

            res.locals.response = "L'équipe a été ajoutée au tournoi";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible d\'inscrire l\'équipe au tournoi'));
        }
    },

    deleteTeamTournament: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await res.locals.database['Teams_Tournaments'].destroy({
                where: {
                    id: res.locals.focus,
                }
            });

            res.locals.response = "L'équipe a été supprimée du tournoi";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de supprimer l\'équipe du tournoi'));
        }
    },

    getTeamWithTeamTournamentId: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { teams_tournamentId } = req.body;

            console.log(teams_tournamentId)

            const teams_tournament = await res.locals.database['Teams_Tournaments'].findAll({
                where: {
                    id: teams_tournamentId,
                },
                include: [
                    { 
                        model: res.locals.database['Teams'],
                        attributes: ['id', 'name'],
                    },
                ]
            });

            res.locals.response = teams_tournament;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer les équipes du tournoi'));
        }
    }
}