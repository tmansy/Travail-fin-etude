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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SuperMiddlewares = void 0;
var tracer_1 = require("tracer");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var logger = (0, tracer_1.colorConsole)();
var _ = __importStar(require("underscore"));
exports.SuperMiddlewares = {
    Bind: function (value) {
        return function (req, res, next) {
            Object.assign(res.locals, value);
            next();
        };
    },
    Authorization: function (req, res, next) {
        // On vérifie la présence et la validité d'un token
        var token = req.headers.authorization;
        res.locals.session = res.locals.session || {};
        // logger.error(`Check Token ${token}`)
        if (token && token.length > 0 && _.isString(token)) {
            if (token.startsWith("bearer") || token.startsWith("Bearer")) {
                token = token.substring(6).trim();
            }
            // var token = split && split.length>0 ? split[1] : undefined;
            var decoded = jsonwebtoken_1["default"].decode(token, { complete: true });
            res.locals.session.decoded = decoded;
            res.locals.session.payload = decoded && decoded.payload;
            res.locals.session.token = token;
        }
        next();
    },
    CheckAuthorization: function (req, res, next) {
        // On vérifie la présence et la validité d'un token
        var token = req.headers.authorization;
        res.locals.session = res.locals.session || {};
        // logger.error(`Check Token ${token}`)
        if (token && token.length > 0 && _.isString(token)) {
            if (token.startsWith("bearer") || token.startsWith("Bearer")) {
                token = token.substring(6).trim();
            }
            // var token = split && split.length>0 ? split[1] : undefined;
            var decoded = jsonwebtoken_1["default"].decode(token, { complete: true });
            res.locals.session.decoded = decoded;
            res.locals.session.payload = decoded && decoded.payload;
            res.locals.session.token = token;
            // logger.log(token, decoded)
            next();
        }
        else {
            next(new Error("Auth.token : Cette requête est soumise à l'envoi d'un token"));
        }
    },
    CheckScope: function (scope) {
        return function (req, res, next) {
            var payload = res.locals.session && res.locals.session.payload || {};
            if (scope === payload.client_id) {
                next();
            }
            else {
                next(new Error("You are not allowed to acceed this scope {".concat(scope, "} with this client_id {").concat(payload.client_id, "}")));
            }
        };
    },
    setHeader: function (key, value) {
        return function (req, res, next) {
            res.setHeader('X-Powered-By', 'Inforius');
            next();
        };
    }
};
//# sourceMappingURL=SuperMiddlewares.js.map