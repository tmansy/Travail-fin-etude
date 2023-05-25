import { Request, Response, NextFunction } from "express";

const mailjet = require('node-mailjet').connect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
);

export const ContactControllers = {
    sendMail: (req: Request, res: Response, next: NextFunction) => {
        const body = req.body;

        const request = mailjet.post('send', { version: 'v3.1' }).request ({
            Messages: [
                {
                    From: {
                        Email: "noreply@myinforius.be",
                        Name: "Inforius",
                    },
                    To: [
                        {
                            Email: 'theo.mansy@gmail.com',
                        }
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
        request.then(() => {
            res.locals.response = "Le mail a bien été envoyé";
            next();
        }).catch((err) => {
            next(err);
        })
    },
}