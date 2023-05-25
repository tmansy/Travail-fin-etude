import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class News extends GenericModel implements SuperModel {
    name = 'news';
    alias = 'News';
    public = true;
    hasMany = ['Comments'];
    belongsTo = ['Users'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        title: {
            type: DataTypes.STRING(255),
            comment: 'Titre de l\'actualité',
        },
        content: {
            type: DataTypes.TEXT(),
            comment: 'Contenu de l\'actualité',
        },
        image_url: {
            type: DataTypes.STRING(255),
            comment: 'Bannière de l\'actualité',
        },
        category: {
            type: DataTypes.STRING(255),
            comment: 'Catégorie de l\'actualité',
        }
    }
}