import { GenericModel, SuperModel } from 'super-rest-api';
import { DataTypes } from "sequelize";

export default class MembershipRequests extends GenericModel implements SuperModel {
    name = 'membershipRequests';
    alias = 'MembershipRequests';
    public = true;
    belongsTo = ['Users'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        message: {
            type: DataTypes.STRING(255),
            comment: 'Message de la demande d\'affiliation',
        },
        status: {
            type: DataTypes.STRING(255),
            comment: 'Statut de la demande d\'affiliation',
        },
        accepted_by: {
            type: DataTypes.STRING(255),
            comment: 'Personne qui a accepté la demande',
        },
    }
}