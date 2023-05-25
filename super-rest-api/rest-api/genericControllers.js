"use strict";
exports.__esModule = true;
exports.GenericControllers = void 0;
var genericMethods_1 = require("./genericMethods");
function GenericControllers(table) {
    return {
        get: function (req, res, next) { return genericMethods_1.GenericMethods.get(table, req, res, next); },
        sync: function (req, res, next) { return genericMethods_1.GenericMethods.sync(table, req, res, next); },
        put: function (req, res, next) { return genericMethods_1.GenericMethods.put(table, req, res, next); },
        post: function (req, res, next) { return genericMethods_1.GenericMethods.post(table, req, res, next); },
        "delete": function (req, res, next) { return genericMethods_1.GenericMethods["delete"](table, req, res, next); },
        count: function (req, res, next) { return genericMethods_1.GenericMethods.count(table, req, res, next); },
        getHistoric: function (req, res, next) { return genericMethods_1.GenericMethods.get(table + "_Historic", req, res, next); }
    };
}
exports.GenericControllers = GenericControllers;
;
//# sourceMappingURL=genericControllers.js.map