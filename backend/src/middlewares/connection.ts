import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";
import { colorConsole } from "tracer";
import { User } from "../domain/user";
import { GatewayIntentBits } from 'discord.js';

const Discord = require('discord.js');
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.login('MTE3NDAyNzUzNzg0OTAwNDA2NA.GTCKD-.mTl5ceSdKXwfMB9JIXpE604aXGqCeuf9hXHhV0');
const logger = colorConsole();

export const ConnectionControllers = {
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const username = req.body.username;
            const password = req.body.password;

            const user = await database['Users'].findOne({
                where: {
                    [Op.or]: [
                        { username: username },
                        { email: username },
                    ]
                },
                include: [
                    { model: database['Users_Roles'] }
                ]
            });

            const hashedPassword = user ? user.password : "";
            const passwordMatch = bcrypt.compareSync(password, hashedPassword);

            if(passwordMatch) {
                const token = jwt.sign({ userId: user.id }, `${process.env.SECRET_KEY}`, { expiresIn: '24h' });

                res.locals.response = {
                    user: user,
                    token: token,
                };
                next();
            }
            else next(new Error("Le login ou le mot de passe est incorrect."));
        } catch (error) {
            logger.error(error);
            next(new Error("Impossible de se connecter."));
        }
    },

    signup: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;
            const body = req.body;

            const newUser = User.createFromBody(body);

            if(!newUser.password) next(new Error("Impossible de hasher le mot de passe."));

            const userExists = await database['Users'].findOne({
                where: {
                    [Op.or]: [
                        { username: body.username },
                        { email: body.email }
                    ]
                }
            });

            if(userExists) next(new Error("Ce nom d'utilisateur n'est pas disponible."));

            const user = await database['Users'].create(newUser);

            await database['Users_Roles'].create({
                roleId: 1,
                userId: user.id,
            });

            res.locals.response = user;
            next();
        } catch (error) {
            logger.error(error);
            next(new Error("Impossible de s'inscrire"));
        }
    }
}
