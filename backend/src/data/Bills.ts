import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Bills extends GenericModel implements SuperModel {
    name = 'bills';
    alias = 'Bills';
    public = true;
    hasMany = ['Bills_BillStatus'];
    belongsTo = ['Orders', 'Users'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        bill_number: {
            type: DataTypes.STRING(255),
            comment: 'Numéro de la facture',
        },
        total_amount: {
            type: DataTypes.FLOAT(),
            comment: 'Montant total de la facture',
        },
    }
}
