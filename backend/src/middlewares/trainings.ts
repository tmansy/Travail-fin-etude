import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";
import { Training } from "../domain/training";

const logger = colorConsole();

export const TrainingsControllers = {
    getOneTraining: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainingId = res.locals.focus;

            const _training = await res.locals.database['Trainings'].findOne({
                where: {
                    id: trainingId,
                }
            });

            const training = Training.createFromDB(_training.toJSON());

            res.locals.response = training;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer l\'entraînement avec cet id'));
        }
    },

    getAllTrainings: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _trainings = await res.locals.database['Trainings'].findAll();

            const trainings = _trainings.map((training) => Training.createFromDB(training.toJSON()));

            res.locals.response = trainings;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer les entraînements'));
        }
    },

    postTraining: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainingBody = Training.createFromBody(req.body);

            const training = await res.locals.database['Trainings'].create(trainingBody);

            res.locals.response = training;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de créer l\'entraînement'));
        }
    },
    
    putTraining: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainingId = res.locals.focus;
            const trainingBody = Training.createFromBody(req.body);

            await res.locals.database['Trainings'].update(trainingBody, {
                where: {
                    id: trainingId,
                }
            });

            const _training = await res.locals.database['Trainings'].findOne({
                where: {
                    id: trainingId,
                }
            });

            const training = Training.createFromDB(_training.toJSON());

            res.locals.response = training;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de modifier l\'entraînement'));
        }
    },

    deleteTraining: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const trainingId = res.locals.focus;

            await res.locals.database['Trainings'].destroy({
                where: {
                    id: trainingId,
                }
            });

            res.locals.response = "L'entraînement a bien été supprimé";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de supprimer l\'entraînement'));
        }
    },
}