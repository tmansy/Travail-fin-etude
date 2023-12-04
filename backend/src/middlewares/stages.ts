import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";

const logger = colorConsole();

export const StagesControllers = {
    getStage: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stageData = await res.locals.database['Stages'].findAll({
                where: {
                    tournamentId: res.locals.focus,
                },
            });

            res.locals.stage = stageData.map((x) => x.toJSON());
            next();
        } catch (error) {
            logger.error(error);
            next('Impossible de récupérer les informations du stage');
        }
    },

    getMatches: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const matchesData = await res.locals.database['Matches'].findAll({
                where: {
                    stageId: res.locals.stage[0].id,
                },
            });

            res.locals.matches = matchesData.map((x) => x.toJSON());
            next();
        } catch (error) {
            logger.error(error);
            next('Impossible de récupérer les informations des matchs');
        }
    },

    getOpponents: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const matchesId = [];

            for(const match of res.locals.matches) {
                matchesId.push(match.id);
            }

            const opponents = await res.locals.database['Opponents'].findAll({
                where: {
                    matchId: matchesId,
                }
            });

            res.locals.opponents = opponents.map((x) => x.toJSON());
            next();
        } catch (error) {
            logger.error(error);
            next('Impossible de récupérer les informations des opposants');
        }
    },

    getParticipants: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const participants = await res.locals.database['Teams_Tournaments'].findAll({
                where: {
                    tournamentId: res.locals.focus,
                },
                include: [
                    { model: res.locals.database['Teams'] },
                ]
            });

            res.locals.participants = participants.map((x) => x.toJSON());
            next();
        } catch (error) {
            logger.error(error);
            next('Impossible de récupérer les informations des opposants');
        }
    },

    mapInformations: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
                stages: res.locals.stage.map((stage) => {
                    return {
                        id: stage.id,
                        tournament_id: stage.tournamentId,
                        name: stage.name,
                        type: stage.type,
                        number: stage.number,
                        settings: {
                            groupCount: stage.group_count,
                            size: stage.size,
                            seedOrdering: [stage.seedOrdering],
                            consolationFinal: stage.consolationFinal == 1 ? true : false,
                            matchesChildCount: stage.matchesChildCount,
                        }
                    }
                }),
                matches: res.locals.matches.map((match) => {
                    const opponent1 = res.locals.opponents.filter((opponent) => {
                        return opponent.matchId == match.id && opponent.position == 1;
                    });

                    const opponent2 = res.locals.opponents.filter((opponent) => {
                        return opponent.matchId == match.id && opponent.position == 2;
                    });

                    return {
                        id: match.id,
                        number: match.number,
                        stage_id: match.stageId,
                        group_id: match.group,
                        round_id: match.round,
                        child_count: match.child_count,
                        status: match.status,
                        opponent1: {
                            id: opponent1.length > 0 ? opponent1[0].teamsTournamentId : null,
                            position: opponent1[0]?.position,
                            result: opponent1[0]?.result != null ? opponent1[0].result : undefined,
                            score: opponent1[0]?.score != null ? opponent1[0].score : undefined,
                        },
                        opponent2: {
                            id: opponent2.length > 0 ? opponent2[0]?.teamsTournamentId : null,
                            position: opponent2[0]?.position,
                            result: opponent2[0]?.result != null ? opponent2[0].result : undefined,
                            score: opponent2[0]?.score != null ? opponent2[0].score : undefined,
                        },
                    }
                }),
                matchGames: [],
                participants: res.locals.participants.map((participant) => {
                    return {
                        id: participant.id,
                        name: participant.team.name,
                        tournament_id: participant.tournamentId,
                    }
                }),
            };

            res.locals.response = data;
            next();
        } catch (error) {
            logger.error(error);
            next('Impossible de de mapper les informations du tournoi');
        }
    },
}