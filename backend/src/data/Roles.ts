import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Roles extends GenericModel implements SuperModel {
    name = 'roles';
    alias = 'Roles';
    public = true;
    hasMany = ['Users'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        label: {
            type: DataTypes.STRING(255),
            comment: 'Nom du rôle',
        },
    }
}