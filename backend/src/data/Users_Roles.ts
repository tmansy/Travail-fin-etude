import { GenericModel, SuperModel } from 'super-rest-api';

export default class Users_Roles extends GenericModel implements SuperModel {
    name = 'users_roles';
    alias = 'Users_Roles';
    public = true;
    belongsTo = ['Users', 'Roles'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = { }
}