import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Sponsors extends GenericModel implements SuperModel {
    name = 'sponsors';
    alias = 'Sponsors';
    public = true;
    hasMany = ['Sponsors_Teams', 'Sponsors_Tournaments'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        name: {
            type: DataTypes.STRING(255),
            comment: 'Nom du sponsor',
        },
        logo: {
            type: DataTypes.TEXT,
            comment: 'Logo du sponsor',
        },
        banner: {
            type: DataTypes.TEXT,
            comment: 'Bannière du sponsor',
        },
        description: {
            type: DataTypes.STRING(255),
            comment: 'Description du sponsor',
        },
        website: {
            type: DataTypes.STRING(255),
            comment: 'Site web du sponsor',
        },
        email: {
            type: DataTypes.STRING(255),
            comment: 'Adresse mail du sponsor',
        },
        phone: {
            type: DataTypes.STRING(255),
            comment: 'Numéro de téléphone du sponsor',
        },
    }
}