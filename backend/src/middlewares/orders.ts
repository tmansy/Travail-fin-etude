import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";

const logger = colorConsole();

export const OrdersControllers = {
    createOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de créer la commande'));
        }
    },

    updateOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de modifier la commande'));
        }
    },

    getOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer la commande'));
        }
    },

    getAllOrders: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer les commandes'));
        }
    }
}