import { ApiError, ErrorCodeAPi } from "../modules/errors/errors";
import { Team, TeamDAO } from "./team";
import { User, UserDAO } from "./user";

export enum roleTeam {
    ADMINISTRATOR,
    PLAYER,
    CAPTAIN,
    SUBSTITUTE,
    ANALYST,
    COACH,
}

export type User_teamDAO = {
    id: number;
    roleTeam: roleTeam;
    userId: number;
    teamId: number;
    createdAt: Date;
    updatedAt: Date;
    user?: UserDAO;
    team?: TeamDAO;
}

type EnumType = typeof roleTeam;

export class User_team {
    public id: number;
    public roleTeam: roleTeam;
    public userId: number;
    public teamId: number;
    public createdAt: Date;
    public updatedAt: Date;
    public user?: UserDAO;
    public team?: TeamDAO;

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

    public static createFromDB(body: User_teamDAO) {
        const user_team = new User_team();

        user_team.id = body.id;
        user_team.roleTeam = User_team.getEnumFromValue(body.roleTeam, roleTeam);
        user_team.userId = body.userId;
        user_team.teamId = body.teamId;
        user_team.createdAt = body.createdAt;
        user_team.updatedAt = body.updatedAt;

        if(body.user) user_team.user = User.createFromDB(body.user);
        if(body.team) user_team.team = Team.createFromDB(body.team);

        return user_team;
    }

    public static filterUniqueTeams(userTeams: User_team[]): User_team[] {
        const uniqueTeams = new Map<number, User_team>();

        for (const userTeam of userTeams) {
            const teamId = userTeam.teamId;
            
            if (!uniqueTeams.has(teamId)) {
                uniqueTeams.set(teamId, userTeam);
            }
        }
        
        return Array.from(uniqueTeams.values());
    }
}