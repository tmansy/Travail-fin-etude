import bcrypt from 'bcrypt';
import { User_role, User_roleDAO } from './user_role';
import { Membership_request, Membership_requestDAO } from './membership_request';

export enum rank {
    IRON,
    BRONZE,
    SILVER,
    GOLD,
    PLATINUM,
    EMERALD,
    DIAMOND,
    MASTER,
    GRANDMASTER,
    CHALLENGER,
}

export enum roleGame {
    TOP,
    JUNGLE,
    MID,
    ADC,
    SUPPORT,
}

export type UserDAO = {
    id: number;
    title: string;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    phone: string;
    birthdate: string;
    rank: rank;
    roleGame: roleGame;
    img: string;
    description: string;
    street: string;
    house_number: string;
    zip_code: string;
    city: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
    usernameInGame: string;
    users_roles?: User_roleDAO[];
    membershipRequests?: Membership_requestDAO[];
}

export class User {
    public id: number;
    public title: string;
    public firstname: string;
    public lastname: string;
    public email: string;
    public username: string;
    public password: string;
    public phone: string;
    public birthdate: string;
    public rank: rank;
    public roleGame: roleGame;
    public img: string;
    public description: string;
    public street: string;
    public house_number: string;
    public zip_code: string;
    public city: string;
    public country: string;
    public createdAt: Date;
    public updatedAt: Date;
    public usernameInGame: string;
    public users_roles?: User_roleDAO[];
    public membershipRequests?: Membership_requestDAO[];

    public static createFromBody(body: UserDAO) {
        const user = new User();

        user.id = body.id;
        user.title = body.title;
        user.firstname = body.firstname;
        user.lastname = body.lastname;
        user.email = body.email;
        user.username = body.username;
        user.phone = body.phone;
        user.birthdate = body.birthdate;
        user.rank = body.rank;
        user.roleGame = body.roleGame;
        user.img = body.img;
        user.description = body.description;
        user.street = body.street;
        user.house_number = body.house_number;
        user.zip_code = body.zip_code;
        user.city = body.city;
        user.country = body.country;
        user.usernameInGame = body.usernameInGame;

        if(body.password) {
            const hash = bcrypt.hashSync(body.password, 10);
            user.password = hash;
        }

        return user;
    }

    public static createFromDB(body: UserDAO) {
        const user = new User();

        user.id = body.id;
        user.title = body.title;
        user.firstname = body.firstname;
        user.lastname = body.lastname;
        user.email = body.email;
        user.username = body.username;
        user.phone = body.phone;
        user.birthdate = body.birthdate;
        user.rank = body.rank;
        user.roleGame = body.roleGame;
        user.img = body.img;
        user.description = body.description;
        user.street = body.street;
        user.house_number = body.house_number;
        user.zip_code = body.zip_code;
        user.city = body.city;
        user.country = body.country;
        user.usernameInGame = body.usernameInGame;

        if(body.users_roles) user.users_roles = body.users_roles.map(ur => User_role.createFromDB(ur));
        if(body.membershipRequests) user.membershipRequests = body.membershipRequests.map(mr => Membership_request.createFromDB(mr));

        return user;
    }
}