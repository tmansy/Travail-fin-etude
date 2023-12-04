import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Stages extends GenericModel implements SuperModel {
    name = 'stages';
    alias = 'Stages';
    public = true;
    belongsTo = ['Tournaments'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        name: {
            type: DataTypes.STRING(255),
            comment: 'Nom du tournoi',
        },
        type: {
            type: DataTypes.STRING(),
            comment: 'Format du tournoi',
        },
        number: {
            type: DataTypes.INTEGER(),
            comment: 'Numéro du stage',
        },
        group_count: {
            type: DataTypes.INTEGER(),
        },
        seedOrdering: {
            type: DataTypes.STRING(255),
            comment: 'Répartition des équipes',
        },
        size: {
            type: DataTypes.TINYINT(),
            comment: 'Taille du tournoi',
        },
        consolationFinal: {
            type: DataTypes.BOOLEAN(),
            comment: 'Prix du tournoi',
        },
        matchesChildCount: {
            type: DataTypes.INTEGER(),
        }
    }
}