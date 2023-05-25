"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.Database = void 0;
var glob = __importStar(require("glob"));
var async = __importStar(require("async"));
var _ = __importStar(require("underscore"));
var _path = __importStar(require("path"));
var connexion_1 = require("./connexion");
var historicModel_1 = require("./historicModel");
var tracer_1 = require("tracer");
var superEnv_1 = require("./superEnv");
var logger = (0, tracer_1.colorConsole)();
var Database = /** @class */ (function () {
    /**
     * @param {String} name The name of the database. By default this is MYSQL_PREFIX{db}
     * @param {String} group The group of Models (if model has no group, by default, this is => model.group = "global")
     */
    function Database(name, group) {
        if (name === void 0) { name = "root"; }
        if (group === void 0) { group = ""; }
        var _this = this;
        var _a;
        this.Tables = {};
        this.connexion = connexion_1.Connexion;
        this.structures = {};
        this.sequelizes = {};
        this.root = __dirname;
        this.scanData = function (path) {
            // logger.trace(`Scan path ${path}`)
            _this.Tables = {};
            if (path && path.length > 0) {
                glob
                    .sync(path, { ignore: [], cwd: "".concat(__dirname, "/") })
                    .map(function (filename) { return require("".concat(filename)); })
                    .map(function (Structure) {
                    var Model = Structure["default"];
                    return new Model();
                })
                    // On ne prend que les models qui ont le group = this.group  
                    // On prend toujours les models qui ont le group "global"
                    // ( on filtre par l'attribut database dans un fichier /data/*.js )
                    .filter(function (model) {
                    var check = String(_this.group) === String(model.group) || model.group === "global";
                    // logger.info(`Model <${model.alias}> is in group <${String(model.group)}>. Selected for database ${this.name}/${this.group}? ${check}`)
                    return check;
                })
                    .map(function (model) {
                    var _a, _b;
                    var _sequelize = model.group === "global" ? "root_sequelize" : "sequelize";
                    if (_this[_sequelize]) {
                        var hooks = {};
                        if (typeof (model.afterValidate) === "function")
                            hooks.afterValidate = model.afterValidate;
                        if (typeof (model.beforeBulkCreate) === "function")
                            hooks.beforeBulkCreate = model.beforeBulkCreate;
                        if (typeof (model.beforeBulkDestroy) === "function")
                            hooks.beforeBulkDestroy = model.beforeBulkDestroy;
                        if (typeof (model.beforeBulkUpdate) === "function")
                            hooks.beforeBulkUpdate = model.beforeBulkUpdate;
                        if (typeof (model.beforeValidate) === "function")
                            hooks.beforeValidate = model.beforeValidate;
                        if (typeof (model.validationFailed) === "function")
                            hooks.validationFailed = model.validationFailed;
                        if (typeof (model.beforeCreate) === "function")
                            hooks.beforeCreate = model.beforeCreate;
                        if (typeof (model.beforeDestroy) === "function")
                            hooks.beforeDestroy = model.beforeDestroy;
                        if (typeof (model.afterFind) === "function")
                            hooks.afterFind = model.afterFind;
                        if (typeof (model.beforeFind) === "function")
                            hooks.beforeFind = model.beforeFind;
                        if (typeof (model.beforeUpdate) === "function")
                            hooks.beforeUpdate = model.beforeUpdate;
                        if (typeof (model.beforeSave) === "function")
                            hooks.beforeSave = model.beforeSave;
                        if (typeof (model.beforeUpsert) === "function")
                            hooks.beforeUpsert = model.beforeUpsert;
                        if (typeof (model.afterCreate) === "function")
                            hooks.afterCreate = model.afterCreate;
                        if (typeof (model.afterDestroy) === "function")
                            hooks.afterDestroy = model.afterDestroy;
                        if (typeof (model.afterUpdate) === "function")
                            hooks.afterUpdate = model.afterUpdate;
                        if (typeof (model.afterSave) === "function")
                            hooks.afterSave = model.afterSave;
                        if (typeof (model.afterUpsert) === "function")
                            hooks.afterUpsert = model.afterUpsert;
                        if (typeof (model.afterBulkCreate) === "function")
                            hooks.afterBulkCreate = model.afterBulkCreate;
                        if (typeof (model.afterBulkDestroy) === "function")
                            hooks.afterBulkDestroy = model.afterBulkDestroy;
                        if (typeof (model.afterBulkUpdate) === "function")
                            hooks.afterBulkUpdate = model.afterBulkUpdate;
                        //! On créer un table d'historique pour cette table là !
                        var historic_model = new historicModel_1.HistoricModel(model);
                        if (model.keepStory) {
                            var SequelizeHistoricModel = _this[_sequelize].define(historic_model.name, historic_model.attributes, {
                                paranoid: false
                            });
                            historic_model.model = SequelizeHistoricModel;
                            _this.Tables["".concat(model.group, "_historic")] = _this.Tables["".concat(model.group, "_historic")] || [];
                            _this.Tables["".concat(model.group, "_historic")].push({
                                name: historic_model.name,
                                alias: historic_model.alias
                            });
                            Object.assign(_this, (_a = {}, _a[historic_model.alias] = SequelizeHistoricModel, _a));
                            _this.structures[historic_model.alias] = historic_model;
                            hooks.afterValidate = historic_model.afterValidate;
                        }
                        var SequelizeModel = _this[_sequelize].define(model.name, model.attributes, {
                            hooks: hooks,
                            paranoid: model.paranoid,
                            scopes: model.scopes || {}
                        });
                        model.model = SequelizeModel;
                        if (model.keepStory) {
                            historic_model.setParentModel(SequelizeModel);
                        }
                        _this.Tables[model.group] = _this.Tables[model.group] || [];
                        _this.Tables[model.group].push({
                            name: model.name,
                            alias: model.alias
                        });
                        if (model.alias) {
                            Object.assign(_this, (_b = {}, _b[model.alias] = SequelizeModel, _b));
                            _this.structures[model.alias] = model;
                        }
                    }
                });
            }
            else {
                logger.error("It lacks path : scanData ( path )");
            }
            Object.keys(_this.structures).forEach(function (modelAlias) {
                var structure = _this.structures[modelAlias];
                if (_.isObject(structure) &&
                    _.isObject(structure.model) &&
                    _.isObject(structure.associate)) {
                    structure.associate(_this);
                }
                else {
                    logger.error((structure &&
                        structure.name + " => " + structure.model + " not exists !") ||
                        modelAlias);
                }
            });
            // this.Sequelize = Sequelize;
            return _this;
        };
        this.sync = function (options) {
            if (options === void 0) { options = { alter: true }; }
            var _sequelize = _this.group === "global" ? "root_sequelize" : "sequelize";
            return new Promise(function (resolve, reject) {
                // 	logger.log("Try to install " + database)
                async.waterfall([
                    function (callback) {
                        if (_this.group !== "global") {
                            _this.root_sequelize
                                .query("CREATE DATABASE IF NOT EXISTS ".concat(_this.name, ";"))
                                .then(function (result) {
                                callback(null);
                            })["catch"](function (err) {
                                logger.log(err);
                                callback(err);
                            });
                        }
                        else
                            callback(null);
                    },
                    function (callback) {
                        if (_this.group !== "global") {
                            _this.root_sequelize
                                .query("USE ".concat(_this.name, ";"))
                                .then(function (result) {
                                callback(null);
                            })["catch"](function (err) {
                                logger.log(err);
                                callback(err);
                            });
                        }
                        else
                            callback(null);
                    },
                    function (callback) {
                        _this.root_sequelize
                            .query("SET FOREIGN_KEY_CHECKS = 0;")
                            .then(function () {
                            callback(null);
                        })["catch"](function (err) {
                            logger.log(err);
                            callback(err);
                        });
                    },
                    function (callback) {
                        _this.sequelize
                            .query("SET FOREIGN_KEY_CHECKS = 0;")
                            .then(function () {
                            callback(null);
                        })["catch"](function (err) {
                            logger.log(err);
                            callback(err);
                        });
                    },
                    function (callback) {
                        var keys = Object.keys(_this.structures);
                        async.eachSeries(keys, function (key, nextKey) {
                            var model = _this.structures[key].model;
                            model
                                .sync(options)
                                .then(function () {
                                nextKey(null);
                            })["catch"](function (err) {
                                logger.log(err);
                                nextKey(err);
                            });
                        }, function (err) {
                            if (err) {
                                logger.log(err);
                                callback(err);
                            }
                            else
                                callback(null);
                        });
                    },
                    function (callback) {
                        _this.root_sequelize
                            .query("SET FOREIGN_KEY_CHECKS = 1;")
                            .then(function () {
                            callback(null);
                        })["catch"](function (err) {
                            logger.log(err);
                            callback(err);
                        });
                    },
                    function (callback) {
                        _this.sequelize
                            .query("SET FOREIGN_KEY_CHECKS = 1;")
                            .then(function () {
                            callback(null);
                        })["catch"](function (err) {
                            logger.log(err);
                            callback(err);
                        });
                    },
                ], function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve(true);
                });
            });
        };
        this.getDatabases = function () {
            var mysql_prefix = process.env.MYSQL_PREFIX;
            var re = mysql_prefix + "([a-z_0-9]+)";
            var regex = new RegExp(re, "gi");
            return _this.root_sequelize
                .query("show databases")
                .then(function (rows) {
                var databases = [];
                if (Array.isArray(rows[0]) && rows[0].length > 0) {
                    rows[0].map(function (row) {
                        if (String(row.Database).search(regex) >= 0) {
                            databases.push(row.Database);
                        }
                    });
                }
                return databases;
            });
        };
        this.name = name;
        this.group = ((_a = String(group)) === null || _a === void 0 ? void 0 : _a.length) > 0 ? group : "global";
        this.group = this.name === "root" ? "global" : this.group;
        logger.log("Build Database for name <".concat(this.name, "> and for group of models <").concat(this.group, ">"));
        this.root_sequelize = this.connexion.sequelize("db");
        if (this.group !== "global") {
            this.sequelize = this.connexion.sequelize(this.name);
        }
        this.root = superEnv_1.SuperConfiguration.root;
        this.scan(_path.join(this.root, '../data/*.js'));
        return this;
    }
    Database.prototype.scan = function (pathToScan) {
        if (!pathToScan)
            throw new Error("You must define a dirname to scan data/*.js");
        this.scanData(pathToScan);
        return this;
    };
    return Database;
}());
exports.Database = Database;
//# sourceMappingURL=buildDatabases.js.map