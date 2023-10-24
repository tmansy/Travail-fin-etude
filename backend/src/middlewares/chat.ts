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

            const newMessage = await db['Messages'].create({
                messageText: _message.messageText,
                userId: _message.userId,
                teamId: _message.teamId,
            });

            const messageToReturn = await db['Messages'].findOne({
                where: {
                    id: newMessage.id,
                },
                include: [
                    { 
                        model: db['Users'], 
                    },
                    { 
                        model: db['Teams'],
                    },
                ]
            });

            return Message.createFromDB(messageToReturn.toJSON());
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
                },
                include: [
                    { 
                        model: db['Users'], 
                    },
                    { 
                        model: db['Teams'],
                    },
                ]
            });

            const messages = allMessages.map(m => Message.createFromDB(m.toJSON()));

            return messages;
        } catch (error) {
            logger.error(error);
        }
    }
}