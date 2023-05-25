import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Sponsors_Tournaments extends GenericModel implements SuperModel {
    name = 'sponsors_tournaments';
    alias = 'Sponsors_Tournaments';
    public = true;
    belongsTo = ['Sponsors', 'Tournaments'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        money: {
            type: DataTypes.INTEGER(),
            comment: 'Argent apporté du sponsor',
        },
    }
}