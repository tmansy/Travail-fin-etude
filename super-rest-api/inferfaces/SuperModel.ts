import { Model } from "sequelize";
import { SuperDomain } from "../index";

export interface SuperModel {
    alias: string;
    name: string;
    model: any;
    parent: string;
    belongsTo?: Array<string>;
    hasOne?: Array<string>;
    hasMany?: Array<string>;
    token: ("create"|"findone"|"findall"|"update"|"destroy"|"historic")[];
    scopes: any;
    keepStory: boolean;
    attributes: any;
    group: string;
    associate: (models: any) => void;
    afterValidate?: (instance: any, options: any) => void;
    beforeBulkCreate?: (instances: any, options: any) => void
    beforeBulkDestroy?: (options: any) => void
    beforeBulkUpdate?: (options: any) => void
    beforeValidate?: (instance: any, options: any) => void
    validationFailed?: (instance: any, options: any, error: any) => void
    beforeCreate?: (instance: any, options: any) => void
    beforeDestroy?: (instance: any, options: any) => void
    beforeUpdate?: (instance: any, options: any) => void
    afterFind?: (instance: any, options: any) => void
    beforeFind?: (options: any) => void
    beforeSave?: (instance: any, options: any) => void
    beforeUpsert?: (values: any, options: any) => void
    afterCreate?: (instance: any, options: any) => void
    afterDestroy?: (instance: any, options: any) => void
    afterUpdate?: (instance: any, options: any) => void
    afterSave?: (instance: any, options: any) => void
    afterUpsert?: (created: any, options: any) => void
    afterBulkCreate?: (instances: any, options: any) => void
    afterBulkDestroy?: (options: any) => void
    afterBulkUpdate?: (options: any) => void
    createRoute: boolean
    readRoute: boolean
    updateRoute: boolean
    deleteRoute: boolean
    route_prefix?: string //Pour ajouter un préfix devant chaque route créée dans le SuperRouter
    cache?: boolean
    public?: boolean
    paranoid?: boolean
    domain?: SuperDomain
    guards?:Array<string>
}