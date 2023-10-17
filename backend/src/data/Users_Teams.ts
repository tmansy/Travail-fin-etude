import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Users_Teams extends GenericModel implements SuperModel {
    name = 'users_teams';
    alias = 'Users_Teams';
    public = true;
    belongsTo = ['Users', 'Teams'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        roleTeam: {
            type: DataTypes.TINYINT(),
            comment: 'Rôle de l\'utilisateur dans l\'équipe',
        },
    }
}