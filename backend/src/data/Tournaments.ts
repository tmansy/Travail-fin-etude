import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Tournaments extends GenericModel implements SuperModel {
    name = 'tournaments';
    alias = 'Tournaments';
    public = true;
    belongsTo = ['Users'];
    hasMany = ['Teams_Tournaments', 'Sponsors_Tournaments'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        name: {
            type: DataTypes.STRING(255),
            comment: 'Nom du tournoi',
        },
        description: {
            type: DataTypes.STRING(255),
            comment: 'Description du tournoi',
        },
        start_date: {
            type: DataTypes.DATE(),
            comment: 'Date de commencement du tournoi',
        },
        end_date: {
            type: DataTypes.DATE(),
            comment: 'Date de fin du tournoi',
        },
        type: {
            type: DataTypes.STRING(255),
            comment: 'Format du tournoi',
        },
        prize: {
            type: DataTypes.INTEGER(),
            comment: 'Prix du tournoi',
        },
        generated: {
            type: DataTypes.TINYINT(),
            defaultValue: 0,
            comment: 'Est-ce que l\'arbre de tournoi a été généré ?',
        }
    }
}