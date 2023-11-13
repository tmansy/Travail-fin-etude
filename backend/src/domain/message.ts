import { Team, TeamDAO } from "./team";
import { User, UserDAO } from "./user";

export type MessageDAO = {
    id: number,
    messageText: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    teamId: number;
    user: UserDAO;
    team: TeamDAO;
}

export class Message {
    public id: number;
    public messageText: string;
    public createdAt: Date;
    public updatedAt: Date;
    public userId: number;
    public teamId: number;
    public user: User;
    public team: Team;

    public static createFromBody(body: MessageDAO): Message {
        const message = new Message();

        message.id = body.id;
        message.messageText = body.messageText;
        message.createdAt = body.createdAt;
        message.updatedAt = body.updatedAt;
        message.userId = body.userId;
        message.teamId = body.teamId;

        return message;
    }

    public static createFromDB(body: MessageDAO): Message {
        const message = new Message();

        message.id = body.id;
        message.messageText = body.messageText;
        message.createdAt = body.createdAt;
        message.updatedAt = body.updatedAt;
        message.userId = body.userId;
        message.teamId = body.teamId;
        message.user = User.createFromDB(body.user);
        message.team = Team.createFromDB(body.team);
        
        return message;
    }
}