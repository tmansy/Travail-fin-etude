"use strict";
exports.__esModule = true;
exports.SequelizeForbidden = exports.SequelizeTeapot = exports.SequelizeWarning = void 0;
var SequelizeWarning = /** @class */ (function () {
    function SequelizeWarning(message) {
        if (message === void 0) { message = "Warning"; }
        this.message = "";
        this.message = message;
    }
    return SequelizeWarning;
}());
exports.SequelizeWarning = SequelizeWarning;
var SequelizeTeapot = /** @class */ (function () {
    function SequelizeTeapot(message) {
        if (message === void 0) { message = "Error"; }
        this.message = "";
        this.message = message;
    }
    return SequelizeTeapot;
}());
exports.SequelizeTeapot = SequelizeTeapot;
var SequelizeForbidden = /** @class */ (function () {
    function SequelizeForbidden(message) {
        if (message === void 0) { message = "Error"; }
        this.message = "";
        this.message = message;
    }
    return SequelizeForbidden;
}());
exports.SequelizeForbidden = SequelizeForbidden;
//# sourceMappingURL=sequelizeWarning.js.map