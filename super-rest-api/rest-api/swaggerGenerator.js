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
exports.SwaggerGenerator = void 0;
var _ = __importStar(require("underscore"));
var async = __importStar(require("async"));
var fs = __importStar(require("fs"));
var tracer_1 = require("tracer");
var __1 = require("..");
var superEnv_1 = require("./superEnv");
var logger = (0, tracer_1.colorConsole)();
var SwaggerGenerator = /** @class */ (function () {
    function SwaggerGenerator(options) {
        var _this = this;
        this.servers = [];
        this.url_acc = "";
        this.url_prod = "";
        this.prefix = "";
        this.parameters = [];
        this.SW_parameters = {};
        this.description = "";
        this.version = "";
        this.title = "";
        this.pathDatas = "";
        this.routesJSON = "";
        this.filename = "";
        this.pathSwagger = "";
        this.database = "";
        Object.assign(this, options);
        this.servers.push({
            description: "Serveur de développement",
            url: "http://localhost:5555".concat(this.prefix)
        });
        if (this.url_acc && this.url_acc.length > 0)
            this.servers.push({
                description: "Serveur d'acceptance",
                url: "".concat(this.url_acc).concat(this.prefix)
            });
        if (this.url_prod && this.url_prod.length > 0)
            this.servers.push({
                description: "Serveur de production",
                url: "".concat(this.url_prod).concat(this.prefix)
            });
        this.SW_parameters = {};
        this.parameters.map(function (parameter) {
            _this.SW_parameters[parameter.name] = {
                "in": "path",
                name: parameter.name,
                description: "the name as a string of the focussed entity",
                required: true,
                schema: {
                    type: parameter.type
                }
            };
        });
        this.doc = {
            openapi: this.version || "3.0.0",
            servers: this.servers,
            info: {
                description: this.description || "No description",
                version: this.version,
                title: this.title,
                contact: {
                    email: "pierre.pulinckx@inforius.be"
                }
            },
            tags: [],
            paths: {},
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT"
                    }
                },
                responses: {
                    UnauthorizedError: {
                        description: "Access token is missing or invalid"
                    },
                    Forbidden: {
                        description: "Forbidden"
                    }
                },
                parameters: this.SW_parameters,
                schemas: {}
            }
        };
        return this;
    }
    SwaggerGenerator.prototype.generate = function () {
        var _this = this;
        var models;
        var schemas = {};
        if (superEnv_1.SuperConfiguration.createDatabase) {
            models = new __1.Database(this.database).scan(this.pathDatas);
        }
        return new Promise(function (resolve, reject) {
            async.waterfall([
                function (cb) {
                    var _a;
                    async.each((_a = models === null || models === void 0 ? void 0 : models.root_sequelize) === null || _a === void 0 ? void 0 : _a.models, function (model, callback) {
                        model
                            .describe()
                            .then(function (res) {
                            _this.doc.components.schemas[model.name.toLowerCase()] = {
                                type: "object",
                                properties: res
                            };
                            // doc.tags.push({
                            // 	name : utils.capitalize(model.name),
                            // 	description : "", // to define
                            // })
                            callback(null);
                        })["catch"](function (e) {
                            callback(null);
                        });
                    }, function () {
                        cb(null);
                    });
                },
                function (cb) {
                    var _a;
                    async.each((_a = models === null || models === void 0 ? void 0 : models.sequelize) === null || _a === void 0 ? void 0 : _a.models, function (model, callback) {
                        model
                            .describe()
                            .then(function (res) {
                            _this.doc.components.schemas[model.name.toLowerCase()] = {
                                type: "object",
                                properties: res
                            };
                            // doc.tags.push({
                            // 	name : utils.capitalize(model.name),
                            // 	description : "", // to define
                            // })
                            callback(null);
                        })["catch"](function (e) {
                            logger.log(e);
                            callback(null);
                        });
                    }, function () {
                        cb(null);
                    });
                },
                function (cb) {
                    var routes = require(_this.routesJSON);
                    if (_.isArray(routes) && routes.length > 0) {
                        routes.map(function (route) {
                            var _a;
                            var url = route.route;
                            var parameters = route.parameters || [];
                            var obj = {
                                security: [],
                                tags: [__1.SuperTools.capitalize(route.module)],
                                parameters: parameters,
                                description: route.description || "No description",
                                responses: {}
                            };
                            _this.parameters.map(function (parameter) {
                                if (url.includes(":".concat(parameter.name))) {
                                    var regex = new RegExp(":".concat(parameter.name), "gi");
                                    url = url.replace(regex, "{".concat(parameter.name, "}"));
                                    obj.parameters.push({
                                        $ref: "#/components/parameters/".concat(parameter.name)
                                    });
                                }
                            });
                            if (route.method.toLowerCase() === "post") {
                                var contentType = route.contentType || "application/json";
                                var schema = route.schema || {
                                    $ref: "#/components/schemas/" + route.module.toLowerCase()
                                };
                                obj.requestBody = {
                                    required: true,
                                    content: (_a = {},
                                        _a[contentType] = {
                                            schema: schema
                                        },
                                        _a)
                                };
                            }
                            if (route.token) {
                                obj.security.push({
                                    BearerAuth: []
                                });
                                obj.responses["401"] = {
                                    $ref: "#/components/responses/UnauthorizedError"
                                };
                                obj.responses["403"] = {
                                    $ref: "#/components/responses/Forbidden"
                                };
                            }
                            _this.doc.paths[url] = _this.doc.paths[url] || {};
                            _this.doc.paths[url][route.method] = obj;
                        });
                    }
                    cb(null);
                },
                function (cb) {
                    var json = JSON.stringify(_this.doc, null, 4);
                    _this.filename = "".concat(_this.pathSwagger, "/swagger.json");
                    fs.writeFileSync(_this.filename, json);
                    cb();
                },
            ], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(_this.filename);
                }
            });
        });
    };
    return SwaggerGenerator;
}());
exports.SwaggerGenerator = SwaggerGenerator;
//# sourceMappingURL=swaggerGenerator.js.map