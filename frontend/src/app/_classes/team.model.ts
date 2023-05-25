export class Team {
    public name: string;
    public logo: string;
    public description: string;
    public captain: string;

    constructor(name: string, logo: string, description: string, captain: string) {
        this.name = name;
        this.logo = logo;
        this.description = description;
        this.captain = captain;
    }
}