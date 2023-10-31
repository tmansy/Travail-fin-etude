import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";

const logger = colorConsole();

export const CartsControllers = {
    createCart: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de créer le panier'));
        }
    },

    updateCart: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de modifier le panier'));
        }
    },

    getCart: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer le panier'));
        }
    },

    getAllCarts: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer les paniers'));
        }
    }
}