import path from "path";
import { Database } from "super-rest-api";
import { colorConsole } from "tracer";

const logger = colorConsole();

export const ChatControllers = {
    sendMessage: async (message: string) => {
        try {
            const db = new Database().scan(path.join(__dirname, "dist/data/*.js"));

            await db['Messages'].create({
                messageText: message,
                // userId: res.locals.session.userId,
            });
        } catch (error) {
            logger.error(error);
        }
    },
}