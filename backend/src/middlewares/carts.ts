import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";

const logger = colorConsole();

export const CartsControllers = {
    updateCart: async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de modifier le panier'));
        }
    },

    getCart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const myCart = await res.locals.database['Carts'].findOne({
                where: {
                    userId: res.locals.focus,
                    validated: 0,
                },
                include: [
                    {
                        model: res.locals.database['Carts_Products'],
                        include: [
                            {
                                model: res.locals.database['Products'],
                            }
                        ]
                    },
                ]
            });

            res.locals.response = myCart;
            next();
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