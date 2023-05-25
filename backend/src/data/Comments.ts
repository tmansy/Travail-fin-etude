import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Comments extends GenericModel implements SuperModel {
    name = 'comments';
    alias = 'Comments';
    public = true;
    belongsTo = ['Users', 'News'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        content: {
            type: DataTypes.TEXT,
            comment: 'Contenu du commentaire de l\'actualité',
        },
    }
}