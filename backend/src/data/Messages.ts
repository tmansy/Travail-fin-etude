import { DataTypes } from "sequelize";
import { GenericModel, SuperModel } from "super-rest-api";

export default class Messages extends GenericModel implements SuperModel {
    name = "messages";
    alias = "Messages";
    public = true;
    belongsTo = ['Users', 'Teams'];

    public token: ('create' | 'findone' | 'findall' | 'update' | 'destroy' | 'historic')[] = ['create', 'findone', 'findall', 'update', 'destroy'];

    attributes = {
        messageText: {
            type: DataTypes.TEXT(),
            comment: 'Contenu du message',
        }
    }
}