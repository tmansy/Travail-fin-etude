import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";

const logger = colorConsole();

export const CartsProductsControllers = {
    createCartProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de créer le panier de produits'));
        }
    },

    updateCartProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de modifier le panier de produits'));
        }
    },

    getCartProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer le panier de produits'));
        }
    },

    getAllCartsProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer les paniers de produits'));
        }
    }
}