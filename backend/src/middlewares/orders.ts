import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";
import { sendDiscordNotification } from "../lib/sendDiscordNotification";

const logger = colorConsole();

export const OrdersControllers = {
    createOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paymentData = req.body;

            const order = await res.locals.database['Orders'].create({
                userId: paymentData.userId,
                total_price: paymentData.totalPrice,
                delivery_house_number: paymentData.delivery_house_number,
                delivery_street: paymentData.delivery_street,
                delivery_zip_code: paymentData.delivery_zip_code,
                delivery_city: paymentData.delivery_city,
                delivery_country: paymentData.delivery_country,
            });

            const message = `Merci à ${paymentData.username} d'avoir valider son panier sur la boutique !`;
            sendDiscordNotification(message);

            res.locals.order = order;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de créer la commande'));
        }
    },

    updatePayment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paymentData = req.body;

            await res.locals.database['Payments'].update({
                method: paymentData.method,
                orderId: res.locals.order.id,
            },
            {
                where: {
                    id: paymentData.paymentId,
                }
            });

            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de modifier la paiement'));
        }
    },

    flagCart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paymentData = req.body;

            await res.locals.database['Carts'].update({
                validated: 1,
            },
            {
                where: {
                    id: paymentData.cartId,
                }
            });

            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de modifier la paiement'));
        }
    },
}