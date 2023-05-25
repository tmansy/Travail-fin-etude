export class User {
    public title: string;
    public firstname: string;
    public lastname: string;
    public email: string;
    public username: string;
    public password: string;
    public phone: string;
    public birthdate: Date;

    constructor(title: string, firstname: string, lastname: string, email: string, username: string, password: string, phone: string, birthdate: Date) {
        this.title = title;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.birthdate = birthdate;
    }
}