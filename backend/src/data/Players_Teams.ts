import { GenericModel, SuperModel } from 'super-rest-api';

export default class Players_Teams extends GenericModel implements SuperModel {
    name = 'players_teams';
    alias = 'Players_Teams';
    public = true;
    belongsTo = ['Players', 'Teams'];
    
    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
    }
}