import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Products_Orders extends GenericModel implements SuperModel {
    name = 'products_orders';
    alias = 'Products_Orders';
    public = true;
    belongsTo: ['Products', 'Orders'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        quantity: {
            type: DataTypes.INTEGER(),
            comment: 'Quantité du produit',
        },
        price: {
            type: DataTypes.FLOAT(),
            comment: 'Prix du produit lors de la commande',
        },
    }
}
