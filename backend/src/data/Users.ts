import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Users extends GenericModel implements SuperModel {
    name = 'users';
    alias = 'Users';
    public = true;
    belongsTo = ['Addresses', 'Roles'];
    hasMany = ['MembershipRequests', 'News', 'Comments', 'Bills', 'Orders', 'Tournaments', 'Players', 'Trainings'];
    
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
    }
}