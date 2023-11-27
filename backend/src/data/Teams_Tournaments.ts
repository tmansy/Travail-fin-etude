import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Teams_Tournaments extends GenericModel implements SuperModel {
    name = 'teams_tournaments';
    alias = 'Teams_Tournaments';
    public = true;
    belongsTo = ['Tournaments', 'Teams'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {}
}