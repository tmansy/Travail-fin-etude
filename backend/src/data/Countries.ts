import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Countries extends GenericModel implements SuperModel {
    name = 'countries';
    alias = 'Countries';
    public = true;
    hasMany = ['Cities'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        name: {
            type: DataTypes.STRING(255),
            comment: 'Nom du pays',
        },
    }
}

// hasMany = à l'extérieur
// belongsTo = à l'intérieur