
import { colorConsole } from "tracer";
import { SuperModel } from "../index";
const logger = colorConsole()
import * as _ from "underscore";
import {SuperDomain} from "./SuperDomain";

export class GenericModel implements SuperModel  {

  public createRoute = true 
  public readRoute = true 
  public updateRoute = true
  public deleteRoute = true 
  public alias = "";
  public name = "";
  public model:any;
  public parent = "";
  public belongsTo = [];
  public hasOne = [];
  public hasMany = [];
  public token: ("create"|"findone"|"findall"|"update"|"destroy"|"historic")[] = ["create", "destroy", "findall", "findone", "historic", "update"];
  public scopes:any = {}
  public keepStory:boolean = false 
  public attributes = {}
  public group:string = "global"
  public paranoid: boolean = true 
  public domain = SuperDomain
  // public timestamps: boolean = true 

  constructor() {
    
  }

  associate = (models:any):void => {
    if (!this.model || !_.isObject(this.model)) {
      logger.error(
        `Probleme avec le model ${this.name}, il manque l'objet this.model`
      );
    }

    this.belongsTo = _.isArray(this.belongsTo) ? this.belongsTo : [];
    this.hasOne = _.isArray(this.hasOne) ? this.hasOne : [];
    this.hasMany = _.isArray(this.hasMany) ? this.hasMany : [];

    this.belongsTo.map((modelAlias:any) => {
      if (_.isString(modelAlias) && _.isObject(models[modelAlias])) {
        this.model.belongsTo(models[modelAlias]);
        // logger.error(`${this.name} belongs to ${modelAlias} !!!`)
      } else if (
        _.isObject(modelAlias) &&
        modelAlias.model &&
        modelAlias.options
      ) {
        this.model.belongsTo(models[modelAlias.model], modelAlias.options);
        // logger.error(`${this.name} belongs to ${modelAlias} !!!`)
      } else {
        logger.error(`${modelAlias} existe pas dans ${this.name} !!!`);
      }
    });

    this.hasMany.map((modelAlias:any) => {
      if (_.isString(modelAlias) && _.isObject(models[modelAlias])) {
        this.model.hasMany(models[modelAlias], { onDelete: "CASCADE" });
        // logger.error(`${this.name} has many ${modelAlias} !!!`)
      } else if (
        _.isObject(modelAlias) &&
        modelAlias.model &&
        modelAlias.options
      ) {
        this.model.hasMany(models[modelAlias.model], modelAlias.options);
        // logger.error(`${this.name} has many ${modelAlias} !!!`)
      } else {
        logger.error(`${modelAlias} existe pas dans  ${this.name} !!!`);
      }
    });

    this.hasOne.map((modelAlias:any) => {
      if (_.isString(modelAlias) && _.isObject(models[modelAlias])) {
        this.model.hasOne(models[modelAlias], { onDelete: "CASCADE" });
      } else if (
        _.isObject(modelAlias) &&
        modelAlias.model &&
        modelAlias.options
      ) {
        this.model.hasOne(models[modelAlias.model], modelAlias.options);
      } else {
        logger.error(`${modelAlias} existe pas dans  ${this.name} !!!`);
      }
    });
  };
}