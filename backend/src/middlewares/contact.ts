import { Request, Response, NextFunction } from "express";
import { colorConsole } from "tracer";

const mailjet = require('node-mailjet').connect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
);

const logger = colorConsole();

export const ContactControllers = {
    sendMail: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body;

            const request = mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [
                    {
                        From: {
                            Email: "noreply@myinforius.be",
                            Name: "Inforius",
                        },
                        To: [
                                { Email: 'theo.mansy@inforius.be' },
                        ],
                        Subject: "Questions R4N",
                        HTMLPart: `Une nouvelle question a été posée. <br><br>
                        Nom: ${body.lastname} <br>
                        Prénom: ${body.firstname} <br>
                        Adresse mail: ${body.email} <br>
                        Numéro de téléphone: ${body.phoneNumber} <br>
                        Question: ${body.message}`
                    }
                ]
            });
    
            await request;
    
            res.locals.response = "Le mail a bien été envoyé";
            next();
        } catch (error) {
            logger.error(error);
            next(new Error(error));
        }
    },
}