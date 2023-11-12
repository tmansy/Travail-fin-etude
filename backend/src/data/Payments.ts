import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Payments extends GenericModel implements SuperModel {
    name = 'payments';
    alias = 'Payments';
    public = true;
    hasMany = ['Payments_PaymentStatus'];
    belongsTo = ['Orders']
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        method: {
            type: DataTypes.STRING(255),
            comment: 'Méthode de payement',
        },
        amount: {
            type: DataTypes.INTEGER(),
            comment: 'Montant total du payement',
        },
        currency: {
            type: DataTypes.TINYINT(),
            comment: 'Monnaie',
        },
        description: {
            type: DataTypes.STRING(),
            comment: 'Description du panier'
        },
        statement_descriptor: {
            type: DataTypes.STRING(),
            comment: 'Communication du paiement',
        },
    }
}
