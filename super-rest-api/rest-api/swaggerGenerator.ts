import * as _ from "underscore";
import * as async from "async";
import * as fs from "fs";
import { colorConsole } from "tracer";
import { Database, SuperTools } from "..";
import { SuperConfiguration } from "./superEnv";
const logger = colorConsole()

export class SwaggerGenerator {

  public servers: any = []
  public url_acc = ""
  public url_prod = ""
  public prefix = ""
  public parameters = []
  public SW_parameters: any = {}
  public doc: any
  public description = ""
  public version = ""
  public title = ""
  public pathDatas = ""
  public routesJSON = ""
  public filename = ""
  public pathSwagger = ""
  public database = ""

  constructor(options: any) {

    Object.assign(this, options);

    this.servers.push({
      description: "Serveur de développement",
      url: `http://localhost:5555${this.prefix}`,
    });

    if (this.url_acc && this.url_acc.length > 0)
      this.servers.push({
        description: "Serveur d'acceptance",
        url: `${this.url_acc}${this.prefix}`,
      });

    if (this.url_prod && this.url_prod.length > 0)
      this.servers.push({
        description: "Serveur de production",
        url: `${this.url_prod}${this.prefix}`,
      });

    this.SW_parameters = {};
    this.parameters.map((parameter: any) => {
      this.SW_parameters[parameter.name] = {
        in: "path",
        name: parameter.name,
        description: "the name as a string of the focussed entity",
        required: true,
        schema: {
          type: parameter.type,
        },
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
          email: "pierre.pulinckx@inforius.be",
        },
      },
      tags: [],
      paths: {},
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        responses: {
          UnauthorizedError: {
            description: "Access token is missing or invalid",
          },
          Forbidden: {
            description: "Forbidden",
          },
        },
        parameters: this.SW_parameters,
        schemas: {},
      },
    };

    return this
  }

  public generate() {

    let models
    const schemas = {};
    if (SuperConfiguration.createDatabase) {
      models = new Database(this.database).scan(this.pathDatas);
    }

    return new Promise((resolve, reject) => {
      async.waterfall([
        (cb: any) => {
          async.each(models?.root_sequelize?.models, (model: any, callback: any) => {
            model
              .describe()
              .then((res: any) => {
                this.doc.components.schemas[model.name.toLowerCase()] = {
                  type: "object",
                  properties: res,
                };

                // doc.tags.push({
                // 	name : utils.capitalize(model.name),
                // 	description : "", // to define
                // })

                callback(null);
              })
              .catch((e: Error) => {
                callback(null);
              });
          },
            () => {
              cb(null);
            }
          );
        },
        (cb: any) => {
          async.each(models?.sequelize?.models, (model: any, callback: any) => {
            model
              .describe()
              .then((res: any) => {
                this.doc.components.schemas[model.name.toLowerCase()] = {
                  type: "object",
                  properties: res,
                };

                // doc.tags.push({
                // 	name : utils.capitalize(model.name),
                // 	description : "", // to define
                // })

                callback(null);
              })
              .catch((e: Error) => {
                logger.log(e);
                callback(null);
              });
          },
            () => {
              cb(null);
            }
          );
        },

        (cb: any) => {
          const routes = require(this.routesJSON);

          if (_.isArray(routes) && routes.length > 0) {
            routes.map((route) => {
              let url = route.route;
              let parameters = route.parameters || [];

              const obj: any = {
                security: [],
                tags: [SuperTools.capitalize(route.module)],
                parameters: parameters,
                description: route.description || "No description",
                responses: {},
              };

              this.parameters.map((parameter: any) => {
                if (url.includes(`:${parameter.name}`)) {
                  var regex = new RegExp(`:${parameter.name}`, "gi");
                  url = url.replace(regex, `{${parameter.name}}`);
                  obj.parameters.push({
                    $ref: `#/components/parameters/${parameter.name}`,
                  });
                }
              });

              if (route.method.toLowerCase() === "post") {
                const contentType = route.contentType || "application/json";
                const schema = route.schema || {
                  $ref: "#/components/schemas/" + route.module.toLowerCase(),
                };
                obj.requestBody = {
                  required: true,
                  content: {
                    [contentType]: {
                      schema: schema,
                      // "encoding": {
                      // 	profileImage : {
                      // 		contentType: "image/png, image/jpeg"
                      // 	}
                      // }
                    },
                  },
                };
              }

              if (route.token) {
                obj.security.push({
                  BearerAuth: [],
                });
                obj.responses["401"] = {
                  $ref: "#/components/responses/UnauthorizedError",
                };
                obj.responses["403"] = {
                  $ref: "#/components/responses/Forbidden",
                };
              }

              this.doc.paths[url] = this.doc.paths[url] || {};
              this.doc.paths[url][route.method] = obj;
            });
          }
          cb(null);
        },
        (cb: any) => {
          const json = JSON.stringify(this.doc, null, 4);
          this.filename = `${this.pathSwagger}/swagger.json`;
          fs.writeFileSync(this.filename, json);
          cb();
        },
      ],
        (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(this.filename);
          }
        }
      );
    });
  }
}