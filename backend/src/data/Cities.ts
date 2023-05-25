import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Cities extends GenericModel implements SuperModel {
    name = 'cities';
    alias = 'Cities';
    public = true;
    belongsTo = ['Countries'];
    hasMany = ['Addresses'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        name: {
            type: DataTypes.STRING(255),
            comment: 'Nom de la ville',
        },
        zip_code: {
            type: DataTypes.INTEGER(),
            comment: 'Code postal de la ville',
        },
    }
}
