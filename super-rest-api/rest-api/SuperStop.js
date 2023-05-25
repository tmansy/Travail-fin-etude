"use strict";
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
exports.SuperStop = exports.SuperErrorHandler = void 0;
var tracer_1 = require("tracer");
var sequelizeWarning_1 = require("./sequelizeWarning");
var logger = (0, tracer_1.colorConsole)();
var SuperErrorHandler = function (error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }
    else {
        var statusCode = 500;
        var message = __spreadArray([], __read(res.locals.message), false);
        logger.error(error);
        // if (err && err.name === "SequelizeDatabaseError") {
        //   message.push(err.original.sqlMessage);
        //   statusCode = 520;
        // } 
        if (error instanceof sequelizeWarning_1.SequelizeWarning) {
            statusCode = 202;
            message = [error.message];
        }
        else if (error instanceof sequelizeWarning_1.SequelizeForbidden) {
            statusCode = 403;
            message = [error.message];
        }
        else if (error instanceof sequelizeWarning_1.SequelizeTeapot) {
            statusCode = 418;
            message = [error.message];
        }
        else if (error instanceof Error) {
            statusCode = 500;
            message.push(error.message);
        }
        else if (error) {
            statusCode = 500;
        }
        var answer = {
            statusCode: statusCode,
            message: message.length > 0 ? message.join(", ") : "Pas de message"
        };
        res.status(statusCode).json(answer);
    }
};
exports.SuperErrorHandler = SuperErrorHandler;
var SuperStop = function (req, res, next) {
    res.status(200).json(res.locals.response);
};
exports.SuperStop = SuperStop;
//# sourceMappingURL=SuperStop.js.map