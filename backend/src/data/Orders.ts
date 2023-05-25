import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Orders extends GenericModel implements SuperModel {
    name = 'orders';
    alias = 'Orders';
    public = true;
    hasMany = ['Products_Orders', 'Bills', 'Payments', ];
    belongsTo = ['Users'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
    }
}
