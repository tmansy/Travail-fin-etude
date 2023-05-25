import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class BillStatus extends GenericModel implements SuperModel {
    name = 'billStatus';
    alias = 'BillStatus';
    public = true;
    hasMany = ['Bills_BillStatus'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        label: {
            type: DataTypes.STRING(255),
            comment: 'Nom du statut',
        },
    }
}
