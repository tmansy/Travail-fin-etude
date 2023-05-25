import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Addresses extends GenericModel implements SuperModel {
    name = 'addresses';
    alias = 'Addresses';
    public = true;
    belongsTo = ['Cities'];
    hasMany = ['Users'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        street: {
            type: DataTypes.STRING(255),
            comment: 'Nom de la rue',
        },
        house_number: {
            type: DataTypes.INTEGER(),
            comment: 'Numéro de maison',
        },
        additional_info: {
            type: DataTypes.STRING(255),
            comment: 'Numéro de boîte aux lettres, etc...',
        },
    }
}