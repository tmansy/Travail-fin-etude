import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Sponsors_Teams extends GenericModel implements SuperModel {
    name = 'sponsors_teams';
    alias = 'Sponsors_Teams';
    public = true;
    belongsTo = ['Sponsors', 'Teams'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        money: {
            type: DataTypes.INTEGER(),
            comment: 'Argent apporté du sponsor',
        },
    }
}