type TeamDAO = {
    id: number;
    name: string;
    logo: string;
    description: string;
    display: number;
}

export class Team {
    public id: number;
    public name: string;
    public logo: string;
    public description: string;
    public display: number;

    public static createFromBody(body: TeamDAO) {
        const team = new Team();

        team.id = body.id;
        team.name = body.name;
        team.logo = body.logo;
        team.description = body.description;
        team.display = body.display ? 1 : 0;

        return team;
    }
}

