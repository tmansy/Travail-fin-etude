import { GenericModel, SuperModel } from 'super-rest-api';

export default class Users_Teams extends GenericModel implements SuperModel {
    name = 'users_teams';
    alias = 'Users_Teams';
    public = true;
    belongsTo = ['Users', 'Teams'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
    }
}