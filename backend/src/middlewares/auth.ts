import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

export const AuthControllers = {
    token: (req: Request, res: Response, next: NextFunction) => {
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
            }
            next();
        });
    },
}