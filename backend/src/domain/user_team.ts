export enum roleTeam {
    ADMINISTRATOR,
    PLAYER,
    CAPTAIN,
    SUBSTITUTE,
}

export class User_team {
    public id: number;
    public roleTeam: roleTeam;
    public userId: number;
    public teamId: number;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(data?) {
        Object.assign(data);
        return this;
    }
}