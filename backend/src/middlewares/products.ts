import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";

const logger = colorConsole();

export const ProductsControllers = {
    createProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de créer le produit'));
        }
    },

    updateProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de modifier le produit'));
        }
    },

    getProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer le produit'));
        }
    },

    getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer les produits'));
        }
    }
}