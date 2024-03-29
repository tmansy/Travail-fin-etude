import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Users extends GenericModel implements SuperModel {
    name = 'users';
    alias = 'Users';
    public = true;
    hasMany = ['MembershipRequests', 'News', 'Comments', 'Bills', 'Orders', 'Tournaments', 'Trainings', 'Users_Roles'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        title: {
            type: DataTypes.STRING(255),
            comment: 'Monsieur ou madame',
        },
        firstname: {
            type: DataTypes.STRING(255),
            comment: 'Prénom de la personne',
        },
        lastname: {
            type: DataTypes.STRING(255),
            comment: 'Prénom de la personne',
        },
        email: {
            type: DataTypes.STRING(255),
            comment: 'Adresse mail de la personne',
        },
        username: {
            type: DataTypes.STRING(255),
            comment: 'Pseudo de la personne',
        },
        password: {
            type: DataTypes.STRING(255),
            comment: 'Mot de passe de la personne',
        },
        phone: {
            type: DataTypes.STRING(255),
            comment: 'Numéro de téléphone de la personne',
        },
        birthdate: {
            type: DataTypes.DATE(),
            comment: 'Date d\'anniversaire de la personne',
        },
        rank: {
            type: DataTypes.TINYINT(),
            comment: 'Classement du joueur sur le jeu'
        },
        roleGame: {
            type: DataTypes.TINYINT(),
            comment: 'Rôle de joueur dans le jeu',
        },
        img: {
            type: DataTypes.TEXT('long'),
            comment: 'Image du joueur',
        },
        description: {
            type: DataTypes.STRING(255),
            comment: 'Description du joueur',
        },
        street: {
            type: DataTypes.STRING(255),
            comment: 'Rue de l\'adresse du joueur',
        },
        house_number: {
            type: DataTypes.STRING(255),
            comment: 'Numéro de maison de l\'adresse du joueur',
        },
        zip_code: {
            type: DataTypes.STRING(255),
            comment: 'Code postal de l\'adresse du joueur',
        },
        city: {
            type: DataTypes.STRING(255),
            comment: 'Ville de l\'adresse du joueur',
        },
        country: {
            type: DataTypes.STRING(255),
            comment: 'Pays de l\'adresse du joueur',
        },
    }
}