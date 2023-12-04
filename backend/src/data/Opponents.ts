import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Opponents extends GenericModel implements SuperModel {
    name = 'opponents';
    alias = 'Opponents';
    public = true;
    belongsTo = ['Matches', 'Teams_Tournaments'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        position: {
            type: DataTypes.INTEGER(),
            comment: 'Position de l\'équipe dans le match',
        },
        result: {
            type: DataTypes.STRING(255),
            comment: 'Résultats de l\'équipe dans le match',
        },
        score: {
            type: DataTypes.INTEGER(),
            comment: 'Score de l\'équipe dans le match',
        },
    }
}