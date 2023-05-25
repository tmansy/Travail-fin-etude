"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Connexion = void 0;
var child_process_1 = require("child_process");
var sequelize_1 = require("sequelize");
var sequelizeLogger_1 = __importDefault(require("./sequelizeLogger"));
var tracer_1 = require("tracer");
var sequelizeCustomTypes_1 = require("./sequelizeCustomTypes");
var logger = (0, tracer_1.colorConsole)();
var SequelizeConnexion = /** @class */ (function () {
    function SequelizeConnexion() {
        this.valid = false;
        this.databases = {};
        this.mysql_prefix = String(process.env.MYSQL_PREFIX);
        this.mysql_user = String(process.env.MYSQL_USER);
        this.mysql_password = String(process.env.MYSQL_PASSWORD);
        this.mysql_host = String(process.env.MYSQL_HOST);
        this.node_env = process.env.NODE_ENV;
        // On vérifie qu'on a bien déterminé les variables d'environnement
        if (!this.node_env) {
            console.error("Il manque NODE_ENV ! do > set NODE_ENV=development|production (on windows) or > export NODE_ENV=development|production (on linux)");
            process.exit(1);
        }
        else if (!this.mysql_prefix) {
            console.error("Il manque MYSQL_PREFIX ! do > set MYSQL_PREFIX=var (on windows) or > export MYSQL_PREFIX=var (on linux)");
            process.exit(1);
        }
        else if (!this.mysql_user) {
            console.error("Il manque MYSQL_USER ! do > set MYSQL_USER=var (on windows) or > export MYSQL_USER=var (on linux)");
            process.exit(1);
        }
        else if (!this.mysql_password) {
            console.error("Il manque MYSQL_PASSWORD ! do > set MYSQL_PASSWORD=var (on windows) or > export MYSQL_PASSWORD=var (on linux)");
            process.exit(1);
        }
        else if (!this.mysql_host) {
            console.error("Il manque MYSQL_HOST ! do > set MYSQL_HOST=var (on windows) or > export MYSQL_HOST=var (on linux)");
            process.exit(1);
        }
        else {
            this.valid = true;
        }
    }
    SequelizeConnexion.prototype.getMatches = function (string, regex, index) {
        index || (index = 1); // default to the first capturing group
        var matches = [];
        var match;
        while ((match = regex.exec(string))) {
            matches.push(match[index]);
        }
        return matches;
    };
    SequelizeConnexion.prototype.sequelize = function (_database) {
        var _this = this;
        var database = typeof _database == "string" && _database.length > 0
            ? this.mysql_prefix + _database
            : null;
        if (database) {
            var configuration = {
                host: this.mysql_host,
                port: 3306,
                dialect: "mysql",
                pool: {
                    max: 50,
                    min: 0,
                    idle: 100
                },
                query: {}
            };
            var sequelize = void 0;
            var the_key = "db-" + database;
            if (!this.databases[the_key]) {
                (0, sequelizeCustomTypes_1.createCustomDataType)();
                sequelize = new sequelize_1.Sequelize(database, this.mysql_user, this.mysql_password, Object.assign(configuration, {
                    logging: function (text) {
                        if (_this.node_env === "production") {
                            return false;
                        }
                        else {
                            logger.log((0, sequelizeLogger_1["default"])(text));
                        }
                    }
                }));
                logger.log("create ".concat(database, " sequelize :)"));
                this.databases[the_key] = sequelize;
            }
            else {
                logger.log("".concat(database, " already sequelized :)"));
                sequelize = this.databases[the_key];
            }
            return sequelize;
        }
        else
            return false;
    };
    SequelizeConnexion.prototype.getDatabases = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var command = "mysql -u".concat(_this.mysql_user, " -p").concat(_this.mysql_password, " -e\"SHOW DATABASES;\"");
            var re = _this.mysql_prefix + "([a-z_0-9]+)";
            var regex = new RegExp(re, "gi");
            (0, child_process_1.exec)(command, function (error, stdout, stderr) {
                if (error) {
                    logger.error("exec error: ".concat(error));
                    reject(error);
                    return;
                }
                else {
                    var databases = _this.getMatches(String(stdout), regex, 1);
                    resolve(databases);
                }
            });
        });
    };
    return SequelizeConnexion;
}());
exports.Connexion = new SequelizeConnexion();
//# sourceMappingURL=connexion.js.map