import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";

const logger = colorConsole();

export const ProductsOrdersControllers = {
    createProductOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de créer la commande de produits'));
        }
    },

    updateProductOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de modifier la commande de produits'));
        }
    },

    getProductOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer la commande de produits'));
        }
    },

    getAllProductOrders: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer les commandes de produits'));
        }
    }
}