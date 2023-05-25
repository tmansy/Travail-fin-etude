import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Payments_PaymentStatus extends GenericModel implements SuperModel {
    name = 'payments_paymentStatus';
    alias = 'Payments_PaymentStatus';
    public = true;
    belongsTo = ['Payments', 'PaymentStatus'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
    }
}
