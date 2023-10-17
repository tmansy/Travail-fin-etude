import { ApiError, ErrorCodeAPi } from "../modules/errors/errors";

export enum Status {
    ACCEPTED,
    REFUSED,
    ONHOLD,
    UNAFFILIATED,
}

type Membership_requestDAO = {
    id: number;
    title: string;
    lastname: string;
    firstname: string;
    username: string;
    birthdate: string;
    phone: string;
    street: string;
    houseNumber: string;
    zip_code: string;
    city: string;
    country: string;
    message: string;
    status: Status;
    modified_by: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
}

type EnumType = typeof Status;

export class Membership_request {
    public id: number;
    public title: string;
    public lastname: string;
    public firstname: string;
    public username: string;
    public birthdate: string;
    public phone: string;
    public street: string;
    public houseNumber: string;
    public zip_code: string;
    public city: string;
    public country: string;
    public message: string;
    public status: Status;
    public modified_by: string;
    public createdAt: Date;
    public updatedAt: Date;
    public userId: number;

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

    public static createFromDB(body: Membership_requestDAO) {
        const request = new Membership_request();

        request.id = body.id;
        request.title = body.title;
        request.lastname = body.lastname;
        request.username = body.username;
        request.birthdate = body.birthdate;
        request.phone = body.phone;
        request.street = body.street;
        request.houseNumber = body.houseNumber;
        request.zip_code = body.zip_code;
        request.city = body.city;
        request.country = body.country;
        request.message = body.message;
        if(body.status) request.status = Membership_request.getEnumFromValue(body.status, Status);
        request.modified_by = body.modified_by;
        request.createdAt = body.createdAt;
        request.updatedAt = body.updatedAt;
        request.userId = body.userId;

        return request;
    }

    public static createFromBody(body: Membership_requestDAO) {
        const request = new Membership_request();

        request.id = body.id;
        request.title = body.title;
        request.lastname = body.lastname;
        request.firstname = body.firstname;
        request.username = body.username;
        request.birthdate = body.birthdate;
        request.phone = body.phone;
        request.street = body.street;
        request.houseNumber = body.houseNumber;
        request.zip_code = body.zip_code;
        request.city = body.city;
        request.country = body.country;
        request.message = body.message;
        request.status = Membership_request.getEnumFromValue(2, Status);
        request.modified_by = body.modified_by;
        request.createdAt = body.createdAt;
        request.updatedAt = body.updatedAt;
        request.userId = body.userId;

        return request;
    }
}