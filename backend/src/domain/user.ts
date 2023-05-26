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

    constructor(data?) {
        Object.assign(this, data);
        return this;
    }
}