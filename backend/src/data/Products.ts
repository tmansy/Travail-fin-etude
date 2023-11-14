import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Products extends GenericModel implements SuperModel {
    name = 'products';
    alias = 'Products';
    public = true;
    hasMany = ['Products_Orders'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        label: {
            type: DataTypes.STRING(255),
            comment: 'Nom du produit',
        },
        description: {
            type: DataTypes.STRING(255),
            comment: 'Description du produit',
        },
        price: {
            type: DataTypes.FLOAT(),
            comment: 'Prix du produit',
        },
        stock: {
            type: DataTypes.INTEGER(),
            comment: 'Stock restant du produit',
        },
        category: {
            type: DataTypes.TINYINT(),
            comment: 'Catégorie du produit',
        },
        image: {
            type: DataTypes.TEXT('long'),
            comment: 'Image du produit',
        },
    }
}
