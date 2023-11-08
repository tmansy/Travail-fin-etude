import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";
import { Product } from "../domain/product";

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
            let products = await res.locals.database['Products'].findAll();

            products = products.map((product) => Product.createFromDB(product.toJSON()));

            res.locals.response = products;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer les produits'));
        }
    }
}