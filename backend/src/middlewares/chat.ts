import path from "path";
import { Database } from "super-rest-api";
import { colorConsole } from "tracer";
import { Message } from "../domain/message";

const logger = colorConsole();

export const ChatControllers = {
    sendMessage: async (message: Message) => {
        try {
            const db = new Database().scan(path.join(__dirname, "dist/data/*.js"));
            const _message = Message.createFromBody(message);

            await db['Messages'].create({
                messageText: _message.messageText,
                userId: _message.userId,
                teamId: _message.teamId,
            });

        } catch (error) {
            logger.error(error);
        }
    },

    getAllMessages: async (teamId: number) => {
        try {
            const db = new Database().scan(path.join(__dirname, "dist/data/*.js"));
            const allMessages = await db['Messages'].findAll({
                where: {
                    teamId: teamId,
                }
            });

            const messages = allMessages.map(m => Message.createFromDB(m.toJSON()));
        } catch (error) {
            logger.error(error);
        }
    }
}