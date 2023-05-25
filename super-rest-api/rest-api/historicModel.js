"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.HistoricModel = void 0;
var _ = __importStar(require("underscore"));
var tracer_1 = require("tracer");
var genericModel_1 = require("./genericModel");
var sequelize_1 = require("sequelize");
var logger = (0, tracer_1.colorConsole)();
var HistoricModel = /** @class */ (function (_super) {
    __extends(HistoricModel, _super);
    function HistoricModel(Model) {
        var _this = _super.call(this) || this;
        _this.setParentModel = function (model) {
            _this.parentModel = model;
            return _this;
        };
        _this.afterValidate = function (instance, options) {
            var locals = options.locals;
            if (locals === null || locals === void 0 ? void 0 : locals.where) {
                var keys = _.keys(instance._changed);
                var changed_1 = keys.map(function (key) { return instance._changed[key] && key; });
                var changes_1 = {};
                changed_1.map(function (key) {
                    changes_1[key] = instance.dataValues[key];
                });
                return new Promise(function (resolve) {
                    _this.parentModel.findOne({
                        where: locals.where,
                        hooks: false
                    }).then(function (instance) {
                        var _a, _b;
                        if ((instance === null || instance === void 0 ? void 0 : instance.id) > 0) {
                            var toCreate = instance.toJSON();
                            toCreate.itemId = toCreate.id;
                            toCreate.changed = changed_1;
                            toCreate.changes = changes_1;
                            toCreate.userId = (_b = (_a = locals.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
                            delete toCreate.id;
                            delete toCreate.guid;
                            delete toCreate.code;
                            delete toCreate.updatedAt;
                            delete toCreate.createdAt;
                            delete toCreate.deletedAt;
                            _this.model.create(toCreate).then(function () {
                                resolve(true);
                            })["catch"](function (err) {
                                logger.error(err);
                                resolve(true);
                            });
                        }
                        else
                            resolve(true);
                    })["catch"](function (err) {
                        logger.error(err);
                        resolve(true);
                    });
                });
            }
            else {
                logger.log("No locals.where for historicModel : ".concat(locals === null || locals === void 0 ? void 0 : locals.where));
                return Promise.resolve(true);
            }
        };
        _this.keepStory = false;
        Object.assign(_this, Model);
        _this.name += "_historic";
        _this.alias += "_Historic";
        _this.attributes = _.clone(Model.attributes);
        Object.assign(_this.attributes, {
            userId: {
                type: sequelize_1.DataTypes.INTEGER()
            },
            action: {
                type: sequelize_1.DataTypes.STRING()
            },
            itemId: {
                type: sequelize_1.DataTypes.INTEGER()
            },
            changed: {
                type: sequelize_1.DataTypes.JSON
            },
            changes: {
                type: sequelize_1.DataTypes.JSON
            }
        });
        return _this;
    }
    return HistoricModel;
}(genericModel_1.GenericModel));
exports.HistoricModel = HistoricModel;
//# sourceMappingURL=historicModel.js.map