import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Orders extends GenericModel implements SuperModel {
    name = 'orders';
    alias = 'Orders';
    public = true;
    hasMany = ['Products_Orders', 'Bills', 'Payments'];
    belongsTo = ['Users'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        total_price: {
            type: DataTypes.FLOAT(),
            comment: 'Prix total de la commande (quantity * unit_price)',
        },
        delivery_house_number: {
            type: DataTypes.STRING(),
            comment: 'Numéro de maison de l\'adresse à laquelle la commande doit être livrée',
        },
        delivery_street: {
            type: DataTypes.STRING(),
            comment: 'Rue de l\'adresse à laquelle la commande doit être livrée',
        },
        delivery_zip_code: {
            type: DataTypes.STRING(),
            comment: 'Code postal de l\'adresse à laquelle la commande doit être livrée',
        },
        delivery_city: {
            type: DataTypes.STRING(),
            comment: 'Ville de l\'adresse à laquelle la commande doit être livrée',
        },
        delivery_country: {
            type: DataTypes.STRING(),
            comment: 'Pays de l\'adresse à laquelle la commande doit être livrée',
        },
        status: {
            type: DataTypes.INTEGER(),
            comment: 'Statut de la commande',
        }
    }
}
