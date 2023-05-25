"use strict";

import { exec } from "child_process";
import { Options, Sequelize } from "sequelize";
import sequelizeLogger from "./sequelizeLogger";
import * as _ from "underscore";

import { colorConsole } from "tracer";
import { createCustomDataType } from "./sequelizeCustomTypes";
const logger = colorConsole()

class SequelizeConnexion {

  public valid = false;
  public databases: any = {};
  public mysql_prefix: string = String(process.env.MYSQL_PREFIX);
  public mysql_user: string = String(process.env.MYSQL_USER);
  public mysql_password: string = String(process.env.MYSQL_PASSWORD);
  public mysql_host: string = String(process.env.MYSQL_HOST);
  public node_env = process.env.NODE_ENV;

  constructor() {

    // On vérifie qu'on a bien déterminé les variables d'environnement
    if (!this.node_env) {
      console.error(
        "Il manque NODE_ENV ! do > set NODE_ENV=development|production (on windows) or > export NODE_ENV=development|production (on linux)"
      );
      process.exit(1);
    } else if (!this.mysql_prefix) {
      console.error(
        "Il manque MYSQL_PREFIX ! do > set MYSQL_PREFIX=var (on windows) or > export MYSQL_PREFIX=var (on linux)"
      );
      process.exit(1);
    } else if (!this.mysql_user) {
      console.error(
        "Il manque MYSQL_USER ! do > set MYSQL_USER=var (on windows) or > export MYSQL_USER=var (on linux)"
      );
      process.exit(1);
    } else if (!this.mysql_password) {
      console.error(
        "Il manque MYSQL_PASSWORD ! do > set MYSQL_PASSWORD=var (on windows) or > export MYSQL_PASSWORD=var (on linux)"
      );
      process.exit(1);
    } else if (!this.mysql_host) {
      console.error(
        "Il manque MYSQL_HOST ! do > set MYSQL_HOST=var (on windows) or > export MYSQL_HOST=var (on linux)"
      );
      process.exit(1);
    } else {
      this.valid = true;
    }
  }

  getMatches(string: string, regex: RegExp, index: number) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while ((match = regex.exec(string))) {
      matches.push(match[index]);
    }
    return matches;
  }

  sequelize(_database: string) {
    const database =
      typeof _database == "string" && _database.length > 0
        ? this.mysql_prefix + _database
        : null;

    if (database) {
      var configuration: Options = {
        host: this.mysql_host,
        port: 3306,
        dialect: "mysql",
        pool: {
          max: 50,
          min: 0,
          idle: 100,
        },
        query: {},
      };


      let sequelize;
      const the_key = "db-" + database;

      if (!this.databases[the_key]) {

        createCustomDataType()

        sequelize = new Sequelize(
          database,
          this.mysql_user,
          this.mysql_password,
          Object.assign(configuration, {
            logging: (text: string) => {
              if (this.node_env === "production") {
                return false
              }
              else {
                logger.log(sequelizeLogger(text));
              }
            }
          })
        )
        logger.log(`create ${database} sequelize :)`);
        this.databases[the_key] = sequelize;
      } else {
        logger.log(`${database} already sequelized :)`);
        sequelize = this.databases[the_key];
      }

      return sequelize;
    } else return false;
  }

  getDatabases() {
    return new Promise((resolve, reject) => {
      const command = `mysql -u${this.mysql_user} -p${this.mysql_password} -e"SHOW DATABASES;"`;
      const re = this.mysql_prefix + "([a-z_0-9]+)";
      const regex = new RegExp(re, "gi");
      exec(command, (error: any, stdout: any, stderr: any) => {
        if (error) {
          logger.error(`exec error: ${error}`);
          reject(error);
          return;
        } else {
          var databases = this.getMatches(String(stdout), regex, 1);
          resolve(databases);
        }
      });
    });
  }
}

export const Connexion = new SequelizeConnexion()
