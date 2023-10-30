import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Carts extends GenericModel implements SuperModel {
    name = 'carts';
    alias = 'Carts';
    public = true;
    hasMany = ['Carts_Products'];
    belongsTo = ['Users'];

    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        total_price: {
            type: DataTypes.FLOAT(),
            comment: 'Prix total du panier',
        },
        discount: {
            type: DataTypes.INTEGER(),
            comment: 'Ristourne en % sur le panier',
        },
    }
}
