

import * as _ from "underscore";
import { colorConsole } from "tracer";
import { GenericModel } from "./genericModel";
import { DataTypes } from "sequelize";
import { SuperModel } from "../index";
const logger = colorConsole()

export class HistoricModel extends GenericModel implements SuperModel {

  public parentModel

  constructor(Model: SuperModel) {

    super()
    this.keepStory = false

    Object.assign(this, Model);

    this.name += "_historic";
    this.alias += "_Historic";

    this.attributes = _.clone(Model.attributes)

    Object.assign(this.attributes, {
      userId: {
        type: DataTypes.INTEGER(),
      },
      action: {
        type: DataTypes.STRING(),
      },
      itemId: {
        type: DataTypes.INTEGER(),
      },
      changed: {
        type: DataTypes.JSON,
      },
      changes: { // On devrait remettre un truc qui permet de décrypter dans le cas ou c'est crypté 
        type: DataTypes.JSON,
        // get() {
        //   const val = this.getDataValue("changes");
        //   const temp: any = {};
        //   Object.keys(rawAttributes).map((key) => {
        //     const raw = rawAttributes[key];
        //     let value = val[key];
        //     // logger.log(raw.get)
        //     if (raw.get && _.isFunction(raw.get)) {
        //       value = CustomTypes.decrypt(value);
        //     }
        //     temp[key] = value;
        //   });
        //   return temp;
        // },
      },
    })

    return this

  }

  setParentModel = (model) => {
    this.parentModel = model
    return this
  }

  afterValidate = (instance: any, options: any) => {

    const locals = options.locals;
    if( locals?.where ) {
      const keys = _.keys(instance._changed);
      const changed = keys.map((key) => instance._changed[key] && key);
      const changes: any = {};
      changed.map((key) => {
        changes[key] = instance.dataValues[key];
      });
  
      return new Promise((resolve) => {
        this.parentModel.findOne({
          where: locals.where,
          hooks: false
        }).then((instance) => {
          if (instance?.id > 0) {
            const toCreate = instance.toJSON();
            toCreate.itemId = toCreate.id;
            toCreate.changed = changed;
            toCreate.changes = changes;
            toCreate.userId = locals.session?.user?.id;
            delete toCreate.id;
            delete toCreate.guid;
            delete toCreate.code;
            delete toCreate.updatedAt;
            delete toCreate.createdAt;
            delete toCreate.deletedAt;
            this.model.create(toCreate).then(() => {
              resolve(true);
            }).catch((err: any) => {
              logger.error(err);
              resolve(true);
            });
          }
          else resolve(true);
        }).catch((err: any) => {
          logger.error(err);
          resolve(true);
        });
      });

    }
    else {
      logger.log(`No locals.where for historicModel : ${locals?.where}`)
      return Promise.resolve(true) 
    }

  }

}

