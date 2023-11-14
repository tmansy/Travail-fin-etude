import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";
import { Product } from "../domain/product";

const logger = colorConsole();

export const ProductsControllers = {
    createProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _product = Product.createFromBody(req.body);

            const product = await res.locals.database['Products'].create(_product);

            res.locals.response = product;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de créer le produit'));
        }
    },

    updateProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _product = Product.createFromBody(req.body);

            let currentProduct = await res.locals.database['Products'].findOne({
                where: {
                    id: res.locals.focus,
                }
            });

            currentProduct = Product.createFromDB(currentProduct.toJSON());

            const product = await res.locals.database['Products'].update({
                label: _product.label,
                description: _product.description,
                price: _product.price,
                stock: _product.stock,
                category: _product.category,
                image: _product.image ? _product.image : currentProduct.image,
            }, 
            {
                where: {
                    id: res.locals.focus,
                }
            });

            res.locals.response = _product;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de modifier le produit'));
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
    },

    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = res.locals.focus;

            await res.locals.database['Products'].destroy({
                where: {
                    id: productId,
                }
            });

            res.locals.response = "Le produit a été supprimé";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de récupérer le produit'));
        }
    },
}