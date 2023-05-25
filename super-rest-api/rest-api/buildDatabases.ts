
import * as glob from "glob";
import * as async from "async";
import * as _ from "underscore";
import * as _path from "path";
import { Connexion } from "./connexion";
import { GenericModel } from "./genericModel";
import { HistoricModel } from "./historicModel";
import { SuperModel } from "../index";
import { colorConsole } from "tracer";
import { SuperConfiguration } from "./superEnv";
import { Sequelize } from "sequelize";

const logger = colorConsole()

export class Database {

  public env: any;
  public Tables: any = {};
  public root_sequelize: any;
  public sequelize: any;
  // public Sequelize;
  // public pathModels;
  public group: string
  public name: string
  public connexion = Connexion
  public structures: any = {}
  public sequelizes: any = {}
  public root = __dirname

  /**
   * @param {String} name The name of the database. By default this is MYSQL_PREFIX{db}
   * @param {String} group The group of Models (if model has no group, by default, this is => model.group = "global")
   */
  constructor(name: string = "root", group: string = "") {

    this.name = name;
    this.group = String(group)?.length > 0 ? group : "global";
    this.group = this.name === "root" ? "global" : this.group;

    logger.log(`Build Database for name <${this.name}> and for group of models <${this.group}>`)

    this.root_sequelize = this.connexion.sequelize("db");
    if (this.group !== "global") {
      this.sequelize = this.connexion.sequelize(this.name);
    }

    this.root = SuperConfiguration.root

    this.scan(_path.join(this.root, '../data/*.js'))

    return this;
  }

  scan(pathToScan?: string) {
    if (!pathToScan)
      throw new Error("You must define a dirname to scan data/*.js");
    this.scanData(pathToScan);
    return this;
  }

  scanData = (path: string) => {

    // logger.trace(`Scan path ${path}`)

    this.Tables = {};

    if (path && path.length > 0) {
      glob
        .sync(path, { ignore: [], cwd: `${__dirname}/` })
        .map((filename) => require(`${filename}`))
        .map((Structure) => {
          const Model = Structure.default
          return new Model()
        })
        // On ne prend que les models qui ont le group = this.group  
        // On prend toujours les models qui ont le group "global"
        // ( on filtre par l'attribut database dans un fichier /data/*.js )
        .filter((model: GenericModel) => {
          let check = String(this.group) === String(model.group) || model.group === "global"
          // logger.info(`Model <${model.alias}> is in group <${String(model.group)}>. Selected for database ${this.name}/${this.group}? ${check}`)
          return check;
        })
        .map((model: SuperModel) => {

          const _sequelize = model.group === "global" ? "root_sequelize" : "sequelize";

          if (this[_sequelize]) {

            const hooks: any = {}
            if (typeof (model.afterValidate) === "function") hooks.afterValidate = model.afterValidate;
            if (typeof (model.beforeBulkCreate) === "function") hooks.beforeBulkCreate = model.beforeBulkCreate;
            if (typeof (model.beforeBulkDestroy) === "function") hooks.beforeBulkDestroy = model.beforeBulkDestroy;
            if (typeof (model.beforeBulkUpdate) === "function") hooks.beforeBulkUpdate = model.beforeBulkUpdate;
            if (typeof (model.beforeValidate) === "function") hooks.beforeValidate = model.beforeValidate;
            if (typeof (model.validationFailed) === "function") hooks.validationFailed = model.validationFailed;
            if (typeof (model.beforeCreate) === "function") hooks.beforeCreate = model.beforeCreate;
            if (typeof (model.beforeDestroy) === "function") hooks.beforeDestroy = model.beforeDestroy;
            if (typeof (model.afterFind) === "function") hooks.afterFind = model.afterFind;
            if (typeof (model.beforeFind) === "function") hooks.beforeFind = model.beforeFind;
            if (typeof (model.beforeUpdate) === "function") hooks.beforeUpdate = model.beforeUpdate;
            if (typeof (model.beforeSave) === "function") hooks.beforeSave = model.beforeSave;
            if (typeof (model.beforeUpsert) === "function") hooks.beforeUpsert = model.beforeUpsert;
            if (typeof (model.afterCreate) === "function") hooks.afterCreate = model.afterCreate;
            if (typeof (model.afterDestroy) === "function") hooks.afterDestroy = model.afterDestroy;
            if (typeof (model.afterUpdate) === "function") hooks.afterUpdate = model.afterUpdate;
            if (typeof (model.afterSave) === "function") hooks.afterSave = model.afterSave;
            if (typeof (model.afterUpsert) === "function") hooks.afterUpsert = model.afterUpsert;
            if (typeof (model.afterBulkCreate) === "function") hooks.afterBulkCreate = model.afterBulkCreate;
            if (typeof (model.afterBulkDestroy) === "function") hooks.afterBulkDestroy = model.afterBulkDestroy;
            if (typeof (model.afterBulkUpdate) === "function") hooks.afterBulkUpdate = model.afterBulkUpdate;

            //! On créer un table d'historique pour cette table là !

            const historic_model: HistoricModel = new HistoricModel(model);

            if (model.keepStory) {

              const SequelizeHistoricModel = this[_sequelize].define(historic_model.name, historic_model.attributes, {
                paranoid: false,
              });
              historic_model.model = SequelizeHistoricModel

              this.Tables[`${model.group}_historic`] = this.Tables[`${model.group}_historic`] || []
              this.Tables[`${model.group}_historic`].push({
                name: historic_model.name,
                alias: historic_model.alias,
              });

              Object.assign(this, { [historic_model.alias]: SequelizeHistoricModel })
              this.structures[historic_model.alias] = historic_model;

              hooks.afterValidate = historic_model.afterValidate

            }

            const SequelizeModel = this[_sequelize].define(model.name, model.attributes, {
              hooks: hooks,
              paranoid: model.paranoid,
              scopes : model.scopes || {},
            });

            model.model = SequelizeModel
            
            if (model.keepStory) {
              historic_model.setParentModel(SequelizeModel)
            }

            this.Tables[model.group] = this.Tables[model.group] || []
            this.Tables[model.group].push({
              name: model.name,
              alias: model.alias,
            });

            if (model.alias) {
              Object.assign(this, { [model.alias]: SequelizeModel })
              this.structures[model.alias] = model;
            }


          }
        })

    } else {

      logger.error(`It lacks path : scanData ( path )`);

    }

    Object.keys(this.structures).forEach((modelAlias) => {

      const structure: GenericModel = this.structures[modelAlias];
      if (
        _.isObject(structure) &&
        _.isObject(structure.model) &&
        _.isObject(structure.associate)
      ) {
        structure.associate(this);
      } else {
        logger.error(
          (structure &&
            structure.name + " => " + structure.model + " not exists !") ||
          modelAlias
        );
      }
    });

    // this.Sequelize = Sequelize;

    return this;
  };

  sync = (options: any = { alter: true }) => {

    const _sequelize = this.group === "global" ? "root_sequelize" : "sequelize";

    return new Promise((resolve, reject) => {
      // 	logger.log("Try to install " + database)
      async.waterfall(
        [
          (callback: any) => {
            if (this.group !== "global") {
              this.root_sequelize
                .query(`CREATE DATABASE IF NOT EXISTS ${this.name};`)
                .then((result: any) => {
                  callback(null);
                })
                .catch((err: any) => {
                  logger.log(err);
                  callback(err);
                });
            }
            else callback(null)
          },
          (callback: any) => {
            if (this.group !== "global") {
              this.root_sequelize
                .query(`USE ${this.name};`)
                .then((result: any) => {
                  callback(null);
                })
                .catch((err: any) => {
                  logger.log(err);
                  callback(err);
                });
            }
            else callback(null)
          },
          (callback: any) => {
            this.root_sequelize
              .query("SET FOREIGN_KEY_CHECKS = 0;")
              .then(() => {
                callback(null);
              })
              .catch((err: any) => {
                logger.log(err);
                callback(err);
              });
          },
          (callback: any) => {
            this.sequelize
              .query("SET FOREIGN_KEY_CHECKS = 0;")
              .then(() => {
                callback(null);
              })
              .catch((err: any) => {
                logger.log(err);
                callback(err);
              });
          },
          (callback: any) => {
            const keys = Object.keys(this.structures)
            async.eachSeries(keys, (key, nextKey) => {
              const model = this.structures[key].model
              model
                .sync(options)
                .then(() => {
                  nextKey(null);
                })
                .catch((err: any) => {
                  logger.log(err);
                  nextKey(err);
                });
            }, (err) => {
              if (err) {
                logger.log(err);
                callback(err);
              } else callback(null);
            });
          },
          (callback: any) => {
            this.root_sequelize
              .query("SET FOREIGN_KEY_CHECKS = 1;")
              .then(() => {
                callback(null);
              })
              .catch((err: any) => {
                logger.log(err);
                callback(err);
              });
          },
          (callback: any) => {
            this.sequelize
              .query("SET FOREIGN_KEY_CHECKS = 1;")
              .then(() => {
                callback(null);
              })
              .catch((err: any) => {
                logger.log(err);
                callback(err);
              });
          },
        ],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  };

  getDatabases = (): Promise<string[]> => {
    const mysql_prefix = process.env.MYSQL_PREFIX;
    const re = mysql_prefix + "([a-z_0-9]+)";
    const regex = new RegExp(re, "gi");
    return this.root_sequelize
      .query("show databases")
      .then((rows: any) => {
        const databases: Array<any> = [];
        if (Array.isArray(rows[0]) && rows[0].length > 0) {
          rows[0].map((row) => {
            if (String(row.Database).search(regex) >= 0) {
              databases.push(row.Database);
            }
          });
        }
        return databases;
      })
  };
}
