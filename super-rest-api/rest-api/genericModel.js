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
exports.GenericModel = void 0;
var tracer_1 = require("tracer");
var logger = (0, tracer_1.colorConsole)();
var _ = __importStar(require("underscore"));
var SuperDomain_1 = require("./SuperDomain");
var GenericModel = /** @class */ (function () {
    // public timestamps: boolean = true 
    function GenericModel() {
        var _this = this;
        this.createRoute = true;
        this.readRoute = true;
        this.updateRoute = true;
        this.deleteRoute = true;
        this.alias = "";
        this.name = "";
        this.parent = "";
        this.belongsTo = [];
        this.hasOne = [];
        this.hasMany = [];
        this.token = ["create", "destroy", "findall", "findone", "historic", "update"];
        this.scopes = {};
        this.keepStory = false;
        this.attributes = {};
        this.group = "global";
        this.paranoid = true;
        this.domain = SuperDomain_1.SuperDomain;
        this.associate = function (models) {
            if (!_this.model || !_.isObject(_this.model)) {
                logger.error("Probleme avec le model ".concat(_this.name, ", il manque l'objet this.model"));
            }
            _this.belongsTo = _.isArray(_this.belongsTo) ? _this.belongsTo : [];
            _this.hasOne = _.isArray(_this.hasOne) ? _this.hasOne : [];
            _this.hasMany = _.isArray(_this.hasMany) ? _this.hasMany : [];
            _this.belongsTo.map(function (modelAlias) {
                if (_.isString(modelAlias) && _.isObject(models[modelAlias])) {
                    _this.model.belongsTo(models[modelAlias]);
                    // logger.error(`${this.name} belongs to ${modelAlias} !!!`)
                }
                else if (_.isObject(modelAlias) &&
                    modelAlias.model &&
                    modelAlias.options) {
                    _this.model.belongsTo(models[modelAlias.model], modelAlias.options);
                    // logger.error(`${this.name} belongs to ${modelAlias} !!!`)
                }
                else {
                    logger.error("".concat(modelAlias, " existe pas dans ").concat(_this.name, " !!!"));
                }
            });
            _this.hasMany.map(function (modelAlias) {
                if (_.isString(modelAlias) && _.isObject(models[modelAlias])) {
                    _this.model.hasMany(models[modelAlias], { onDelete: "CASCADE" });
                    // logger.error(`${this.name} has many ${modelAlias} !!!`)
                }
                else if (_.isObject(modelAlias) &&
                    modelAlias.model &&
                    modelAlias.options) {
                    _this.model.hasMany(models[modelAlias.model], modelAlias.options);
                    // logger.error(`${this.name} has many ${modelAlias} !!!`)
                }
                else {
                    logger.error("".concat(modelAlias, " existe pas dans  ").concat(_this.name, " !!!"));
                }
            });
            _this.hasOne.map(function (modelAlias) {
                if (_.isString(modelAlias) && _.isObject(models[modelAlias])) {
                    _this.model.hasOne(models[modelAlias], { onDelete: "CASCADE" });
                }
                else if (_.isObject(modelAlias) &&
                    modelAlias.model &&
                    modelAlias.options) {
                    _this.model.hasOne(models[modelAlias.model], modelAlias.options);
                }
                else {
                    logger.error("".concat(modelAlias, " existe pas dans  ").concat(_this.name, " !!!"));
                }
            });
        };
    }
    return GenericModel;
}());
exports.GenericModel = GenericModel;
//# sourceMappingURL=genericModel.js.map