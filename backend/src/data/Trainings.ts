import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Trainings extends GenericModel implements SuperModel {
    name = 'trainings';
    alias = 'Trainings';
    public = true;
    belongsTo = ['Teams', 'Players'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        description: {
            type: DataTypes.STRING(255),
            comment: 'Description de l\'entraînement',
        },
        start_date: {
            type: DataTypes.DATE(),
            comment: 'Date de début de l\'entraînement',
        },
        duration: {
            type: DataTypes.STRING(255),
            comment: 'Durée de l\'entraînement',
        },
    }
}