import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class Trainings extends GenericModel implements SuperModel {
    name = 'trainings';
    alias = 'Trainings';
    public = true;
    belongsTo = ['Teams', 'Users'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        title: {
            type: DataTypes.STRING(),
            comment: 'Nom de l\'entrainement',
        },
        description: {
            type: DataTypes.STRING(255),
            comment: 'Description de l\'entraînement',
        },
        from: {
            type: DataTypes.DATE(),
            comment: 'Date de début de l\'entraînement',
        },
        to: {
            type: DataTypes.DATE(),
            comment: 'Date de fin de l\'entraînement',
        },
    }
}