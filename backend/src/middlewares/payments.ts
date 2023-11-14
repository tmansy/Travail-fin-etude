import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";
import { Payment } from "../domain/payment";

const stripe = require('stripe')(`sk_test_51OBdckGIAsjLcmBQa0MSt4ADPixrgh5dXjs29FIP6tuAXxFiUXxCjH6z3ocWZH2RcOo1ZMFynS2pqySh0cQy1FLO00fFOrRiQb`);
const logger = colorConsole();

export const PaymentsControllers = {
    createPaymentIntent: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _payment = Payment.createFromBody(req.body);
            let paymentIntent;

            const payment = await res.locals.database['Payments'].create({
                amount: _payment.amount,
                cartId: req.body.cartId,
                currency: _payment.currency,
                description: _payment.description,
                statement_descriptor: _payment.statement_descriptor,
            });

            if(payment) {
                await res.locals.database['Payments_PaymentStatus'].create({
                    paymentId: payment.id,
                    paymentStatusId: 1,
                });

                paymentIntent = await stripe.paymentIntents.create({
                    amount: _payment.amount * 100,
                    currency: _payment.currency == 0 ? 'usd' : 'eur',
                    description: _payment.description,
                    statement_descriptor: _payment.statement_descriptor,
                    metadata: {
                        cartId: req.body.cartId,
                    }
                });
            }

            paymentIntent.paymentId = payment.id;
            res.locals.response = paymentIntent;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de créer l\'intention de paiement'));
        }
    },
}