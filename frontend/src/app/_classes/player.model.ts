import { User } from "./user.model";

export class Player extends User{
    public game: string;
    public rank: string;
    public role: string;
    public img: string;
    public description: string;

    constructor(title: string, firstname: string, lastname: string, email: string, username: string, password: string, phone: string, birthdate: Date, game: string, rank: string, role: string, img: string, description: string) {
        super(title, firstname, lastname, email, username, password, phone, birthdate);
        this.game = game;
        this.rank = rank;
        this.role = role;
        this.img = img;
        this.description = description;
    }
}