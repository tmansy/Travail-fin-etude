import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Teams extends GenericModel implements SuperModel {
    name = 'teams';
    alias = 'Teams';
    public = true;
    hasMany = ['Trainings', 'Teams_Tournaments', 'Players_Teams'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        name: {
            type: DataTypes.STRING(255),
            comment: 'Nom de la team',
        },
        logo: {
            type: DataTypes.TEXT(),
            comment: 'Logo de la team'
        },
        description: {
            type: DataTypes.STRING(255),
            comment: 'Description de la team',
        },
        captain: {
            type: DataTypes.STRING(255),
            comment: 'Capitaine actuel de la team',
        }
    }
}