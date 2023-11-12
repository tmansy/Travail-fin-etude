import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";
import { Cart_Product } from "../domain/cart_product";

const logger = colorConsole();

export const CartsProductsControllers = {
    createCartProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cart_product = Cart_Product.createFromBody(req.body);

            let userCart = await res.locals.database['Carts'].findOne({
                where: {
                    userId: req.body.userId,
                }
            });

            if(!userCart) {
                userCart = await res.locals.database['Carts'].create({
                    userId: req.body.userId,
                });
            }
            
            const _cart_product = await res.locals.database['Carts_Products'].create({
                quantity: cart_product.quantity,
                unit_price: cart_product.unit_price,
                total_price: cart_product.total_price,
                size: cart_product.size,
                cartId: userCart.id,
                productId: cart_product.productId,
            });

            res.locals.response = _cart_product;
            next();
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
    },

    updateTotalPriceCart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cartId = res.locals.response.cartId;
            let totalCartPrice = 0;

            let cart_products = await res.locals.database['Carts_Products'].findAll({
                where: {
                    cartId: cartId,
                },
                attributes: ['total_price'],
            });

            cart_products = cart_products.map((x) => x.toJSON());

            for(const cart_product of cart_products) {
                totalCartPrice += cart_product.total_price;
            }

            await res.locals.database['Carts'].update({
                total_price: totalCartPrice,
            },
            {
                where: {
                    id: cartId,
                }
            });

            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible d\'update le prix total du panier'));
        }
    }
}