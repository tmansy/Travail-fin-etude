import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Bills_BillStatus extends GenericModel implements SuperModel {
    name = 'bills_billStatus';
    alias = 'Bills_BillStatus';
    public = true;
    belongsTo = ['Bills', 'BillStatus'];

    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
    }
}
