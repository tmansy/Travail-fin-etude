import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { colorConsole } from "tracer";

const logger = colorConsole();

export const AuthControllers = {
    token: async (req: Request, res: Response, next: NextFunction) => {
        try {
            var token = req.headers.authorization; 

            if (!token) {
                return res.status(401).json({ message: 'Token non fourni' });
            }
            else if(token.startsWith("bearer") || token.startsWith("Bearer") ) {
                token = token.substring(6).trim();
            }

            jwt.verify(token, `${process.env.SECRET_KEY}`, (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({ message: 'Token invalide' });
                } else {
                    if (!res.locals.session) {
                        res.locals.session = {};
                    }
                    res.locals.session.userId = decodedToken.userId;
                }
                next();
            });
        } catch (error) {
            logger.error(error);
            next(new Error('Impossible de vérifier le token'));
        }
    },

    checkIfAdmin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const database = res.locals.database;

            const userRoles = await database['Users_Roles'].findAll({
                where: {
                    userId: res.locals.session.userId,
                }
            });

            if (userRoles.every(role => role.roleId !== 2)) {
                next(new Error('Vous n\'avez pas les droits'));
            } 

            next();
        } catch (error) {
            logger.error(error);
        }
    }
}