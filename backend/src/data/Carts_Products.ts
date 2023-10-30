import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Carts_Products extends GenericModel implements SuperModel {
    name = 'carts_products';
    alias = 'Carts_Products';
    public = true;
    belongsTo = ['Carts', 'Products'];

    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        quantity: {
            type: DataTypes.INTEGER(),
            comment: 'Quantité du produit',
        },
        unit_price: {
            type: DataTypes.FLOAT(),
            comment: 'Prix unitaire du produit',
        },
        total_price: {
            type: DataTypes.FLOAT(),
            comment: 'Prix total du produit (quantity * unit_price)',
        },
    }
}
