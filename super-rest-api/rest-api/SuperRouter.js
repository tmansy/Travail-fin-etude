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
exports.SuperRouter = void 0;
var swaggerGenerator_1 = require("./swaggerGenerator");
var swaggerUi = __importStar(require("swagger-ui-express"));
var _ = __importStar(require("underscore"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var glob = __importStar(require("glob"));
var tracer_1 = require("tracer");
var express_1 = require("express");
var genericControllers_1 = require("./genericControllers");
var superEnv_1 = require("./superEnv");
var logger = (0, tracer_1.colorConsole)();
var SuperRouter = /** @class */ (function () {
    function SuperRouter(options) {
        // Quels sont les avantages de SuperRouter ?
        // Scan "automatiques" du dossier /AppHost et compilation des routes avec les middlewares additionnels
        // Scan "automatiques" du dossier /Data et compilation des routes avec les middlewares additionels
        // Toujours la possibilité d'y ajouter une route totalement personalisée Method.add(route)
        // Un seul objet pour gérer toutes les routes (facile pour générer un swagger)
        // options = {
        // addMiddlewares : (route, middlewares) => {
        // fct....
        // }
        // }
        this.description = "";
        this.prefix = "/api/v1";
        this.generateDocumentation = true;
        this.pathSwagger = "";
        this.title = "";
        this.database = "inforius"; // La base de donnée qu'on scan par défaut
        this.url_prod = "";
        this.url_acc = "";
        this.log = false;
        this.root = __dirname;
        this.pathDatas = "";
        this.pathAppHost = "";
        this.allRoutes = [];
        this.parameters = [];
        this.routes_by_method = {};
        this.router = (0, express_1.Router)();
        this.prefix = options.prefix;
        Object.assign(this, options);
        this.pathDatas = options.pathDatas && options.pathDatas.length > 0 ? options.pathDatas : path.join(this.root, "/data");
        this.pathAppHost = options.pathAppHost && options.pathAppHost.length > 0 ? options.pathAppHost : path.join(this.root, "/appHost");
        this.pathSwagger = options.pathSwagger && options.pathSwagger.length > 0 ? options.pathSwagger : path.join(this.root, "/swagger");
        this.routesJSON = path.join(this.pathSwagger, "/__Routes.json");
        this.pathDatas = path.join(this.pathDatas, "/*.js");
        this.pathAppHost = path.join(this.pathAppHost, "/*.js");
        if (this.log) {
            logger.info("pathDatas : ".concat(this.pathDatas));
            logger.info("pathAppHost : ".concat(this.pathAppHost));
            logger.info("pathSwagger : ".concat(this.pathSwagger));
        }
        if (!this.app) {
            throw new Error("SuperRouter must have app has argument ( app : express() )");
        }
        this.root = superEnv_1.SuperConfiguration.root;
        return this;
    }
    SuperRouter.prototype.buildDocumentation = function () {
        var _this = this;
        return new swaggerGenerator_1.SwaggerGenerator(this).generate().then(function (filename) {
            _this.documentation = filename;
        });
    };
    SuperRouter.prototype.addRoutes = function (routes) {
        var _a;
        if (routes === void 0) { routes = []; }
        (_a = this.allRoutes).push.apply(_a, __spreadArray([], __read(routes), false));
        return this;
    };
    SuperRouter.prototype.add = function (routes) {
        if (routes === void 0) { routes = []; }
        this.addRoutes(routes);
        return this;
    };
    SuperRouter.prototype.addRoute = function (route) {
        this.allRoutes.push(route);
        return this;
    };
    // name : Nom du paramètre. le nom doit être en un mot, sans caractère spéciaux. Il sera bindé à req
    // ex : entity ==> req.entity = param
    // type : Type du paramètre. On fait un check sur le type attendu. Si pas de type (null), alors ca peut être string ou number
    // ex : "string"|"number"
    // doIt(req, res) => {}
    // ex : (res, res) => req.type = "local"
    SuperRouter.prototype.addParam = function (options) {
        var name = options.name;
        var type = options.type;
        var description = options.description;
        var doIt = options.middleware;
        if (!(name && name.length > 0)) {
            throw new Error("SuperRouter Parameter must have [name]");
        }
        if (!(type && type.length > 0)) {
            throw new Error("SuperRouter Parameter must have [type] as number|string");
        }
        this.parameters.push({
            name: name,
            type: type,
            description: description
        });
        this.router.param(String(name), function (req, res, next, param) {
            res.locals[name] =
                type === "string"
                    ? String(param)
                    : type === "number"
                        ? Number(param)
                        : param;
            if ((type === "string" && _.isString(res.locals[name])) ||
                (type === "number" && _.isNumber(res.locals[name])) ||
                !type) {
                if (_.isFunction(doIt))
                    doIt(res);
                next();
            }
            else
                res.status(500).json(":".concat(name, " has to be a ").concat(type));
        });
        return this;
    };
    SuperRouter.prototype.build = function () {
        var _this = this;
        this.allRoutes.map(function (route) {
            var routeMethods = route.methods;
            if (_this.addMiddlewares && _.isFunction(_this.addMiddlewares)) {
                _this.addMiddlewares(route, routeMethods);
            }
            routeMethods.unshift(function (req, res, next) {
                res.locals.pathDatas = _this.pathDatas;
                next();
            });
            // routeMethods.push(genericMiddlewares.socket);
            // routeMethods.push(genericMiddlewares.stop);
            // logger.log(routeMethods)
            _this.routes_by_method[route.method.toLowerCase()] =
                _this.routes_by_method[route.method.toLowerCase()] || {};
            _this.routes_by_method[route.method][route.route] = {
                name: route.name,
                description: route.description,
                public: route.public || false,
                basic: route.basic || false,
                token: route.token || false,
                entity: route.entity || false,
                guards: route.guards || [],
                route: route.route,
                group: route.group,
                module: route.module || "no module",
                parameters: route.parameters || [],
                contentType: route.contentType,
                schema: route.schema
            };
            var check = routeMethods.filter(function (x) { return typeof x !== "function"; });
            if (check.length > 0) {
                logger.log("The route ".concat(route.route, " has method which is not a function"));
            }
            else {
                _this.router.route([route.route])[route.method](routeMethods);
            }
        });
        var routes = [];
        _.each(this.routes_by_method, function (_routes, method) {
            _.each(_routes, function (route, url) {
                route.method = method;
                routes.push(route);
            });
        });
        if (!fs.existsSync(this.pathSwagger)) {
            fs.mkdirSync(this.pathSwagger);
        }
        fs.writeFileSync(this.routesJSON, JSON.stringify(routes, null, 2));
        // logger.log(this.prefix, this.router)
        this.app.use(this.prefix, this.router);
        if (this.generateDocumentation) {
            this.buildDocumentation().then(function () {
                if (_this.log)
                    logger.info("SuperRouter Documentation generated ".concat(_this.documentation));
                _this.app.use("".concat(_this.prefix, "/documentation"), swaggerUi.serve, swaggerUi.setup(require(_this.documentation), {
                    explorer: true
                }));
            });
        }
        if (this.log) {
            logger.info("SuperRouter has ".concat(this.allRoutes.length, " routes"));
            logger.info("RouteJson file is ".concat(this.routesJSON));
        }
        return this;
    };
    SuperRouter.prototype.scan = function () {
        this.scanAppHost();
        this.scanData();
        return this;
    };
    SuperRouter.prototype.scanAppHost = function () {
        var _this = this;
        if (this.log) {
            logger.info("scanAppHost ".concat(this.pathAppHost));
        }
        glob
            //search all files with js extension
            .sync(this.pathAppHost, { ignore: [""], cwd: "".concat(this.root, "/") })
            //map all files found above and return an array with all the exported objects from all the files
            .map(function (filename) { return require("".concat(filename)); })
            .map(function (routes) {
            var _a;
            var _routes = routes["default"];
            //ROUTES
            if (_routes !== undefined && _.isArray(_routes) && _routes.length > 0) {
                (_a = _this.allRoutes).push.apply(_a, __spreadArray([], __read(_routes), false));
            }
        });
        return this;
    };
    SuperRouter.prototype.scanData = function () {
        var _this = this;
        glob
            .sync(this.pathDatas, { ignore: [""], cwd: "".concat(this.root, "/") })
            .map(function (filename) { return require("".concat(filename)); })
            .map(function (Structure) {
            var _a;
            var model;
            try {
                var Model = Structure["default"];
                model = new Model();
            }
            catch (error) {
                logger.error("Try to create new Model for ".concat(JSON.stringify(Structure), " but not works"));
                logger.info("export class CLASSNAME extends GenericModel implements SuperModel");
                logger.log(error);
            }
            if (_.isString(model.name) && model.name.length > 0) {
                model.token = Array.isArray(model.token) ? model.token : [];
                var Controller = (0, genericControllers_1.GenericControllers)(model.alias);
                var prefix = model.route_prefix || "";
                var routes = [];
                if (model.readRoute) {
                    routes.push({
                        name: "get_all_".concat(model.alias),
                        description: "Get all instances of model ".concat(model.alias),
                        method: "get",
                        route: "".concat(prefix).concat(model.parent, "/").concat(model.name),
                        methods: [Controller.get],
                        token: model.token.indexOf("findall") >= 0
                    });
                }
                if (model.readRoute) {
                    routes.push({
                        name: "get_one_".concat(model.alias),
                        method: "get",
                        description: "Get only one instance of model ".concat(model.alias),
                        route: "".concat(prefix).concat(model.parent, "/").concat(model.name, "/:focus"),
                        methods: [Controller.get],
                        token: model.token.indexOf("findone") >= 0
                    });
                }
                if (model.createRoute) {
                    routes.push({
                        name: "create_".concat(model.alias),
                        method: "post",
                        description: "Create one instance of model ".concat(model.alias),
                        route: "".concat(prefix).concat(model.parent, "/").concat(model.name),
                        methods: [
                            Controller.post,
                            // Controller.get,
                        ],
                        token: model.token.indexOf("create") >= 0
                    });
                }
                if (model.updateRoute) {
                    routes.push({
                        name: "update_one_".concat(model.alias),
                        method: "put",
                        description: "Update one instance of model ".concat(model.alias),
                        route: "".concat(prefix).concat(model.parent, "/").concat(model.name, "/:focus"),
                        methods: [Controller.put, Controller.get],
                        token: model.token.indexOf("update") >= 0
                    });
                }
                if (model.deleteRoute)
                    routes.push({
                        name: "delete_one_".concat(model.alias),
                        method: "delete",
                        description: "Delete one instance of model ".concat(model.alias),
                        route: "".concat(prefix).concat(model.parent, "/").concat(model.name, "/:focus"),
                        methods: [Controller["delete"]],
                        token: model.token.indexOf("destroy") >= 0
                    });
                if (model.keepStory) {
                    routes.push({
                        name: "get_all_historic_".concat(model.alias),
                        description: "Get all historic of an instances of model ".concat(model.alias),
                        method: "get",
                        route: "".concat(prefix).concat(model.parent, "/").concat(model.name, "_historics"),
                        methods: [Controller.getHistoric],
                        token: model.token.indexOf("historic") >= 0
                    });
                }
                routes.map(function (route) {
                    route.cache = model.cache || false;
                    route.guards = model.guards || [];
                    route.public = model.public || false;
                    route.module = model.alias;
                    route.group = model.group;
                    // route.entity = (model.parent && model.parent.length>0) || model.entity ? true : false
                });
                (_a = _this.allRoutes).push.apply(_a, __spreadArray([], __read(routes), false));
            }
        });
        return this;
    };
    return SuperRouter;
}());
exports.SuperRouter = SuperRouter;
//# sourceMappingURL=SuperRouter.js.map