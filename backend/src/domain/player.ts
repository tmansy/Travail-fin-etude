import { User } from "./user";


export class Player extends User {
    public game: string;
    public rank: string;
    public role: string;
    public img: string;
    public description: string;

    constructor(data) {
        super(data);
        Object.assign(data);
        return this;
    }
}