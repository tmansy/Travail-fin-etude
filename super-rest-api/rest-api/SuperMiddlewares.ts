import { NextFunction, Request, Response } from "express";
import { SequelizeWarning } from "./sequelizeWarning";
import { ValidationErrorItem } from "sequelize";
import { colorConsole } from "tracer";
import jsonwebtoken from "jsonwebtoken";

const logger = colorConsole()
import * as _ from "underscore";

export const SuperMiddlewares = {

    Bind(value:any) {
        return (req:Request, res:Response, next:NextFunction) => {
            Object.assign(res.locals, value)
            next()
        }
    }, 

    Authorization : (req:Request, res:Response, next:NextFunction) => {
        
        // On vérifie la présence et la validité d'un token
		var token = req.headers.authorization
        
        res.locals.session = res.locals.session || {}
        // logger.error(`Check Token ${token}`)

        if(token && token.length>0 && _.isString(token)) {

            if( token.startsWith("bearer") || token.startsWith("Bearer") ) {
                token = token.substring(6).trim();
            }
            // var token = split && split.length>0 ? split[1] : undefined;
            const decoded = jsonwebtoken.decode(token, {complete: true}) 
            res.locals.session.decoded = decoded 
            res.locals.session.payload = decoded && decoded.payload
            res.locals.session.token = token 

            
        }
        
        next()

    }, 

    CheckAuthorization : (req:Request, res:Response, next:NextFunction) => {
        
        // On vérifie la présence et la validité d'un token
		var token = req.headers.authorization
        
        res.locals.session = res.locals.session || {}
        // logger.error(`Check Token ${token}`)

        if(token && token.length>0 && _.isString(token)) {

            if( token.startsWith("bearer") || token.startsWith("Bearer") ) {
                token = token.substring(6).trim();
            }
            // var token = split && split.length>0 ? split[1] : undefined;
            const decoded = jsonwebtoken.decode(token, {complete: true}) 
            res.locals.session.decoded = decoded 
            res.locals.session.payload = decoded && decoded.payload
            res.locals.session.token = token 

            // logger.log(token, decoded)

            next()

        }

        else {
            next( new Error("Auth.token : Cette requête est soumise à l'envoi d'un token") )
        }

    }, 

    CheckScope : (scope) => {
        return (req:Request, res:Response, next:NextFunction) => {
            const payload = res.locals.session && res.locals.session.payload || {}
            if(scope === payload.client_id) {
                next() 
            }
            else {
                next( new Error(`You are not allowed to acceed this scope {${scope}} with this client_id {${payload.client_id}}`) )
            }
        }
    },

    setHeader : (key, value) => {
        return (req:Request, res:Response, next:NextFunction) => {
            res.setHeader('X-Powered-By', 'Inforius');
            next();
        }
    }

}
