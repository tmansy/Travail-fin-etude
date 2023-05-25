import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Notes extends GenericModel implements SuperModel {
    name = 'notes';
    alias = 'Notes';
    public = true;
    belongsTo = ['Teams'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        title: {
            type: DataTypes.STRING(255),
            comment: 'Titre de la note',
        },
        content: {
            type: DataTypes.INTEGER(),
            comment: 'Contenu de la note',
        },
    }
}