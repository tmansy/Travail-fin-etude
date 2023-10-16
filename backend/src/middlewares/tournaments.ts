import { Request, Response, NextFunction } from "express";

export const TournamentsControllers = {
    createTournament: async(req: Request, res: Response, next: NextFunction) => {
        const db = res.locals.database;
        const body = req.body;

        if(body.type == 'Simple élimination') body.type = 'single_elimination';
        if(body.type == 'Double élimination') body.type = 'double_elimination';
        if(body.type == 'Round-robin') body.type = 'round_robin'
        
        db['Tournaments'].create({
            name: body.name,
            type: body.type,
            description: body.description,
            prize: body.prize,
        }).then((instance) => {
            res.locals.response = instance;
            next();
        }).catch((err) => {
            next(new Error(err));
        })
    },

    updateTournament: async(req: Request, res: Response, next: NextFunction) => {
        const db = res.locals.database;
        const body = req.body;

        if(body.type == 'Simple élimination') body.type = 'single_elimination';
        if(body.type == 'Double élimination') body.type = 'double_elimination';
        if(body.type == 'Round-robin') body.type = 'round_robin'
        
        db['Tournaments'].update({
            name: body.name,
            type: body.type,
            description: body.description,
            prize: body.prize,
        }, {
            where: {
                id: res.locals.focus,
            }
        }).then((instance) => {
            res.locals.response = instance;
            next();
        }).catch((err) => {
            next(new Error(err));
        })
    },

    getTournament: async(req: Request, res: Response, next: NextFunction) => {
        const db = res.locals.database;

        db['Tournaments'].findOne({
            where: {
                id: res.locals.focus,
            },
            attributes: ['name', 'type'],
            include: { model: db['Teams_Tournaments'], include: { model: db['Teams'], attributes: ['id', 'name'] } }
        }).then((instance) => {
            const roster = instance.teams_tournaments.map(teamData => ({
                id: teamData.teamId,
                name: teamData.team.name
            }));
            const formattedData = {
                title: instance.name,
                type: instance.type,
                roster: roster
              };
            res.locals.response = formattedData;
            next();
        }).catch((err) => {
            next(new Error(err));
        })
    },
}