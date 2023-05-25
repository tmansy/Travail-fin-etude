import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class PaymentStatus extends GenericModel implements SuperModel {
    name = 'paymentStatus';
    alias = 'PaymentStatus';
    public = true;
    hasMany = ['Payments_PaymentStatus'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        label: {
            type: DataTypes.STRING(255),
            comment: 'Nom du statut',
        },
    }
}
