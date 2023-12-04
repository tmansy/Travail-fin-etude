import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Matches extends GenericModel implements SuperModel {
    name = 'matches';
    alias = 'Matches';
    public = true;
    belongsTo = ['Stages'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        number: {
            type: DataTypes.INTEGER(),
            comment: 'Numéro du match',
        },
        group: {
            type: DataTypes.INTEGER(),
            comment: 'Numéro du groupe',
        },
        round: {
            type: DataTypes.INTEGER(),
            comment: 'Numéro du round',
        },
        child_count: {
            type: DataTypes.INTEGER(),
            comment: 'Nombre d\'enfants',
        },
        status: {
            type: DataTypes.INTEGER(),
            comment: 'Statut du match',
        }
    }
}