import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Players extends GenericModel implements SuperModel {
    name = 'players';
    alias = 'Players';
    public = true;
    belongsTo = ['Users'];
    hasMany = ['Players_Teams']
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        game: {
            type: DataTypes.STRING(255),
            comment: 'Jeu auxquels le joueur joue',
        },
        rank: {
            type: DataTypes.STRING(255),
            comment: 'Classement du joueur sur le jeu'
        },
        role: {
            type: DataTypes.STRING(255),
            comment: 'Rôle de joueur dans le jeu',
        },
        img: {
            type: DataTypes.TEXT(),
            comment: 'Image du joueur',
        },
        description: {
            type: DataTypes.STRING(255),
            comment: 'Description du joueur',
        }
    }
}