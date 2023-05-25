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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var _ = __importStar(require("underscore"));
var sequelizeWarning_1 = require("./sequelizeWarning");
var sequelize_1 = require("sequelize");
var tracer_1 = require("tracer");
var logger = (0, tracer_1.colorConsole)();
var error = function (e, req, res) {
    var statusCode = 500;
    var message = __spreadArray([], __read(res.message), false);
    logger.error(e);
    if (e && e.name === "SequelizeDatabaseError") {
        message.push(e.original.sqlMessage);
        statusCode = 520;
    }
    else if (e instanceof sequelizeWarning_1.SequelizeWarning) {
        statusCode = 202;
        message.push(e.message);
    }
    else if (e instanceof Error) {
        statusCode = 500;
        message.push(e.message);
    }
    else if (e) {
        statusCode = 500;
        var errors = _.isArray(e.errors) ? e.errors : [];
        errors.map(function (error) {
            if (error instanceof sequelize_1.ValidationErrorItem) {
                message.push(error.message);
            }
            else {
                logger.log(error);
            }
        });
    }
    var answer = {
        statusCode: statusCode,
        message: message.length > 0 ? message.join(", ") : "Pas de message"
    };
    res.status(statusCode).json(answer);
};
module.exports = error;
//# sourceMappingURL=error.js.map