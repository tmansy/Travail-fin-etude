import { ApiError, ErrorCodeAPi } from "../modules/errors/errors";

export enum Method {
    PAYPAL,
    VISA,
    BANCONTACT,
}

export enum Currency {
    USD,
    EUR,
    GBP,
    CAD,
}

type EnumType = typeof Currency | typeof Method;

export type PaymentDAO = {
    id: number;
    method: Method;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    orderId: number;
    currency: Currency;
    description: string;
    statement_descriptor: string;
}

export class Payment {
    public id: number;
    public method: Method;
    public amount: number;
    public createdAt: Date;
    public updatedAt: Date;
    public orderId: number;
    public currency: Currency;
    public description: string;
    public statement_descriptor: string;

    private static getEnumFromValue<T extends EnumType>(value: number, _enum: T): T[keyof T] {
        const keys = Object.keys(_enum).filter((key) => isNaN(Number(key)));
        for (const key of keys) {
            const enumValue = _enum[key];
            if (enumValue === value) {
                return enumValue;
            }
        }
        throw new ApiError(ErrorCodeAPi.BAD_REQUEST, "Aucune valeur correspondante dans l'énumération");
    }

    public static createFromDB(body: PaymentDAO): Payment {
        const payment = new Payment();

        payment.id = body.id;
        payment.amount = body.amount;
        if(body.currency) {
            payment.currency = Payment.getEnumFromValue(body.currency, Currency);
        }
        if(body.method) {
            payment.method = Payment.getEnumFromValue(body.method, Method);
        }
        payment.createdAt = body.createdAt;
        payment.updatedAt = body.updatedAt;
        payment.orderId = body.orderId;
        payment.description = body.description;
        payment.statement_descriptor = body.statement_descriptor;

        return payment;
    }

    public static createFromBody(body: PaymentDAO): Payment {
        const payment = new Payment();

        payment.id = body.id;
        payment.amount = body.amount;
        if(body.currency) {
            payment.currency = Payment.getEnumFromValue(body.currency, Currency);
        }
        if(body.method) {
            payment.method = Payment.getEnumFromValue(body.method, Method);
        }
        payment.createdAt = body.createdAt;
        payment.updatedAt = body.updatedAt;
        payment.orderId = body.orderId;
        payment.description = body.description;
        payment.statement_descriptor = body.statement_descriptor;

        return payment;
    }
}