import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class MembershipRequests extends GenericModel implements SuperModel {
    name = 'membershipRequests';
    alias = 'MembershipRequests';
    public = true;
    belongsTo = ['Users'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        title: {
            type: DataTypes.STRING(255),
            comment: 'Titre de la personne',
        },
        lastname: {
            type: DataTypes.STRING(255),
            comment: 'Nom de la personne',
        },
        firstname: {
            type: DataTypes.STRING(255),
            comment: 'Prénom de la personne',
        },
        username: {
            type: DataTypes.STRING(255),
            comment: 'Nom d\'utilisateur de la personne',
        },
        birthdate: {
            type: DataTypes.STRING(255),
            comment: 'Date d\'anniversaire de la personne',
        },
        phone: {
            type: DataTypes.STRING(255),
            comment: 'Numéro de téléphone de la personne',
        },
        street: {
            type: DataTypes.STRING(255),
            comment: 'Rue de l\'adresse de la personne',
        },
        houseNumber: {
            type: DataTypes.STRING(255),
            comment: 'Numéro de maison de l\'adresse de la personne',
        },
        zip_code: {
            type: DataTypes.STRING(255),
            comment: 'Code postal de l\'adresse de la personne',
        },
        city: {
            type: DataTypes.STRING(255),
            comment: 'Ville de l\'adresse de la personne',
        },
        country: {
            type: DataTypes.STRING(255),
            comment: 'Pays de l\'adresse de la personne',
        },
        message: {
            type: DataTypes.STRING(255),
            comment: 'Message de la demande d\'affiliation',
        },
        status: {
            type: DataTypes.STRING(255),
            comment: 'Statut de la demande d\'affiliation',
        },
        modified_by: {
            type: DataTypes.STRING(255),
            comment: 'Personne qui a accepté la demande',
        },
    }
}