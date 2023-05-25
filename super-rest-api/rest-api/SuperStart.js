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
exports.SuperStart = void 0;
var _ = __importStar(require("underscore"));
var buildDatabases_1 = require("./buildDatabases");
var tracer_1 = require("tracer");
var superEnv_1 = require("./superEnv");
var logger = (0, tracer_1.colorConsole)();
var Databases = {};
var createDatabase = function (locals) {
    var group = locals.group;
    var entity = locals.entity;
    var database;
    if ((group === null || group === void 0 ? void 0 : group.length) > 0 && (entity === null || entity === void 0 ? void 0 : entity.length) > 0) {
        if (Databases[entity] && Databases[entity][group] instanceof buildDatabases_1.Database) {
            logger.trace("the database ".concat(entity, " ").concat(group, " already exist :)"));
            database = Databases[entity][group];
        }
        else {
            database = new buildDatabases_1.Database(entity, group);
            Databases[entity] = Databases[entity] || {};
            Databases[entity][group] = database;
        }
    }
    else if ((entity === null || entity === void 0 ? void 0 : entity.length) > 0) {
        if (Databases[entity] && Databases[entity]["local"] instanceof buildDatabases_1.Database) {
            logger.trace("the database ".concat(entity, " \"local\" already exist :)"));
            database = Databases[entity]["local"];
        }
        else {
            database = new buildDatabases_1.Database(entity);
            Databases[entity] = Databases[entity] || {};
            Databases[entity]["local"] = database;
        }
    }
    else {
        if (Databases["root"] && Databases["root"]["global"] instanceof buildDatabases_1.Database) {
            logger.trace("the database \"root\" \"global\" already exist :)");
            database = Databases["root"]["global"];
        }
        else {
            database = new buildDatabases_1.Database();
            Databases["root"] = Databases["root"] || {};
            Databases["root"]["global"] = database;
        }
    }
    return database;
};
function SuperStart(req, res, next) {
    if (!superEnv_1.SuperConfiguration.root) {
        throw new Error("Please define a SuperConfiguration.root => Folder to scans data.js (ex : path.join(__dirname,'./dist') ) ");
    }
    res.locals.response = {};
    res.locals.message = [];
    res.locals.body = req.body;
    res.locals.query = req.query;
    res.locals.headers = req.headers;
    res.locals.method = req.method;
    var route = String(req.originalUrl);
    var checkRoute = _.isString(route) && route.length > 0;
    if (!checkRoute) {
        next(new Error("Il faut une route pour continuer"));
    }
    else {
        if (superEnv_1.SuperConfiguration.createDatabase) {
            res.locals.database = createDatabase(res.locals);
        }
        next();
    }
}
exports.SuperStart = SuperStart;
//# sourceMappingURL=SuperStart.js.map