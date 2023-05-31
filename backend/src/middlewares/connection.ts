import { Request, Response, NextFunction } from "express";
import async from 'async';
import bcrypt from 'bcrypt';
import { User } from "../domain/user";
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";

export const ConnectionControllers = {
    login: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const username = req.body.username;
        const password = req.body.password;

        async.waterfall([
            (callback) => {
                database['Users'].findOne({
                    where: {
                        username: username,
                    }
                }).then((instance: User) => {
                    if(instance) {
                        const hashedPassword = instance.password;
                        const passwordMatch = bcrypt.compareSync(password, hashedPassword);
                        if(passwordMatch) {
                            const token = jwt.sign({ userId: instance.id }, `${process.env.SECRET_KEY}`, { expiresIn: '24h' });
                            res.locals.response = {
                                user: instance,
                                token: token,
                            };
                            callback();
                        }
                        else {
                            res.locals.response = "false";
                            callback();
                        }
                    }
                    else {
                        res.locals.response = "false";
                        callback();
                    }
                }).catch((err) => {
                    callback(err);
                })
            }
        ], (err) => {
            if(err) {
                next(new Error(err));
            }
            else {
                next();
            }
        })
    },

    signup: (req: Request, res: Response, next: NextFunction) => {
        const database = res.locals.database;
        const body = req.body;
        var hashedPassword;

        async.waterfall([
            (callback) => {
                bcrypt.hash(body.password, 10, (err, hash) => {
                    if(err) {
                        callback(err);
                    }
                    else {
                        hashedPassword = hash;
                        callback();
                    }
                })
            },
            (callback) => {
                database['Users'].findAll({
                    where: {
                        [Op.or]: [
                            { username: body.username },
                            { email: body.email }
                        ]
                    }
                }).then((instances) => {
                    if(instances.length > 0) {
                        res.locals.response = "false";
                        next();
                    }
                    else {
                        callback();
                    }
                }).catch((err) => {
                    callback(err);
                })
            },
            (callback) => {
                database['Users'].create({
                    firstname: body.firstname,
                    lastname: body.lastname,
                    email: body.email,
                    username: body.username,
                    password: hashedPassword,
                    roleId: 1,
                }).then((instance) => {
                    res.locals.response = instance;
                    callback();
                }).catch((err) => {
                    callback(err);
                })
            }
        ], (err) => {
            if(err) {
                next(new Error(err));
            }
            else {
                next();
            }
        })
    }
}

/*
1. Introduction
On va vous présenter le projet de mise en place d'une entreprise manufacturière fictive, AirKick, dans l'ERP e-prelude. 
L'objectif de ce projet est de démontrer l'utilisation des fonctionnalités de gestion intégrée offertes par l'ERP pour optimiser les opérations d'une entreprise de production de ballons de football.

2. Objectifs recherchés par nos travaux
Les objectifs de ce projet sont multiples. 
Tout d'abord, il s'agit de créer une entreprise fictive et de l'intégrer dans l'ERP e-prelude en configurant les différents modules nécessaires à son fonctionnement. 
Ensuite, nous cherchons à mettre en place une gestion intégrée des opérations d'AirKick, de la planification de la production à la gestion des stocks en passant par la gestion des commandes clients. 
Nous visons également à améliorer l'efficacité et la traçabilité des processus de production et à optimiser les flux de matériaux et d'informations au sein de l'entreprise.

3. Problématique
La gestion des opérations dans une entreprise manufacturière présente plusieurs défis. 
La coordination entre les différentes fonctions (production, logistique, vente, etc.) peut être complexe et entraîner des inefficiences si elle n'est pas correctement orchestrée. 
De plus, la gestion des stocks, la planification de la production et la gestion des commandes clients sont des tâches critiques qui nécessitent une coordination étroite pour éviter les ruptures de stock ou les retards de livraison. 
Le choix d'un ERP adapté et sa configuration adéquate sont donc essentiels pour résoudre ces problématiques.

4. Présentation de l'entreprise
AirKick est une entreprise manufacturière spécialisée dans la production de ballons de football de haute qualité. 
Elle opère sur le marché international et propose un seul type de ballon, allant des ballons destinés à la pratique amateur aux modèles utilisés par les professionnels. 
L'entreprise se distingue par sa capacité à innover et à répondre aux exigences spécifiques des clients. 
AirKick compte une équipe expérimentée et engagée dans la recherche constante de l'excellence.

5. Méthodes
Pour atteindre nos objectifs, nous utiliserons une approche méthodique. 
Tout d'abord, nous procéderons à une analyse approfondie des processus de l'entreprise et des besoins spécifiques liés à la gestion de la production et des opérations (ce qui correspond à notre document word).
Ensuite, nous configurerons les modules pertinents de l'ERP e-prelude en adaptant les paramètres aux besoins d'AirKick. 
Nous assurerons également la formation du personnel pour une utilisation efficace de l'ERP.

6. Solutions
Pour résoudre les problématiques identifiées, nous mettrons en place différentes solutions dans l'ERP e-prelude. 
Nous configurerons le module de gestion de la production pour optimiser la planification, la suivi des opérations et la gestion des ressources. 
Nous mettrons également en œuvre un système de gestion des stocks intégré pour assurer un suivi précis des inventaires et une gestion efficace des approvisionnements. 
De plus, nous intégrerons le module de gestion des commandes clients pour améliorer la réactivité et la satisfaction des clients.

- Conclusions + perspectives
Ce projet vise à démontrer l'importance de l'utilisation d'un ERP pour optimiser la gestion d'une entreprise manufacturière. 
En intégrant l'entreprise fictive AirKick dans l'ERP e-prelude, nous avons pu mettre en place des solutions efficaces pour améliorer la planification de la production, la gestion des stocks et la coordination des opérations. 
Les résultats obtenus montrent l'impact positif d'une gestion intégrée sur l'efficacité et la performance globale de l'entreprise. 
Les perspectives futures incluent l'exploration de nouvelles fonctionnalités de l'ERP pour continuer à améliorer les processus opérationnels d'AirKick et optimiser davantage la chaîne de valeur.
En conclusion, l'intégration d'une entreprise manufacturière fictive dans l'ERP e-prelude a permis de mettre en évidence les avantages d'une gestion intégrée des opérations. 
Ce projet constitue une base solide pour la mise en place d'un système ERP efficace dans le domaine de la fabrication de ballons de football et offre des perspectives intéressantes pour l'amélioration continue des processus opérationnels.
*/