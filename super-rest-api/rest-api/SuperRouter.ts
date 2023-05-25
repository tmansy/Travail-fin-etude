import { SwaggerGenerator } from "./swaggerGenerator";
import * as swaggerUi from "swagger-ui-express";
import * as _ from "underscore";
import * as path from "path";
import * as fs from "fs";
import * as glob from "glob"
import { colorConsole } from "tracer";
import { SuperRoute } from "../inferfaces/SuperRoute";
import { SuperParam } from "../inferfaces/SuperParam";
import { SuperRouterOptions } from "../inferfaces/SuperRouterOptions";
import { NextFunction, Request, Response, Router } from "express";
import { SuperModel } from "../index";
import { GenericControllers } from "./genericControllers";
import { SuperConfiguration } from "./superEnv";

const logger = colorConsole()


export class SuperRouter {
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

  public description: string = ""
  public prefix: string = "/api/v1"
  public generateDocumentation = true
  public pathSwagger = ""
  public title = ""
  public database = "inforius" // La base de donnée qu'on scan par défaut
  public url_prod = ""
  public url_acc = ""
  public log = false
  public addMiddlewares: ((route: SuperRoute, middlewares: any[]) => void) | undefined
  public root = __dirname
  public pathDatas: string = ""
  public pathAppHost: string = ""
  public app: any
  public allRoutes: SuperRoute[] = [];
  public parameters: SuperParam[] = [];
  public routes_by_method: any = {};
  public router = Router();
  public documentation: any
  public routesJSON: string

  constructor(options: SuperRouterOptions) {

    this.prefix = options.prefix;
    Object.assign(this, options);

    this.pathDatas = options.pathDatas && options.pathDatas.length > 0 ? options.pathDatas : path.join(this.root, "/data");
    this.pathAppHost = options.pathAppHost && options.pathAppHost.length > 0 ? options.pathAppHost : path.join(this.root, "/appHost");
    this.pathSwagger = options.pathSwagger && options.pathSwagger.length > 0 ? options.pathSwagger : path.join(this.root, "/swagger");

    this.routesJSON = path.join(this.pathSwagger, "/__Routes.json");
    this.pathDatas = path.join(this.pathDatas, "/*.js");
    this.pathAppHost = path.join(this.pathAppHost, "/*.js");

    if (this.log) {
      logger.info(`pathDatas : ${this.pathDatas}`);
      logger.info(`pathAppHost : ${this.pathAppHost}`);
      logger.info(`pathSwagger : ${this.pathSwagger}`);
    }

    if (!this.app) {
      throw new Error(
        `SuperRouter must have app has argument ( app : express() )`
      );
    }

    this.root = SuperConfiguration.root
    return this;
  }

  buildDocumentation() {
    return new SwaggerGenerator(this).generate().then((filename) => {
      this.documentation = filename;
    });
  }

  addRoutes(routes = []) {
    this.allRoutes.push(...routes);
    return this;
  }

  add(routes = []) {
    this.addRoutes(routes);
    return this;
  }

  addRoute(route: SuperRoute) {
    this.allRoutes.push(route);
    return this;
  }

  // name : Nom du paramètre. le nom doit être en un mot, sans caractère spéciaux. Il sera bindé à req
  // ex : entity ==> req.entity = param
  // type : Type du paramètre. On fait un check sur le type attendu. Si pas de type (null), alors ca peut être string ou number
  // ex : "string"|"number"
  // doIt(req, res) => {}
  // ex : (res, res) => req.type = "local"
  addParam(options: SuperParam) {
    const name = options.name;
    const type = options.type;
    const description = options.description;
    const doIt = options.middleware;

    if (!(name && name.length > 0)) {
      throw new Error(`SuperRouter Parameter must have [name]`);
    }
    if (!(type && type.length > 0)) {
      throw new Error(
        `SuperRouter Parameter must have [type] as number|string`
      );
    }

    this.parameters.push({
      name: name,
      type: type,
      description: description,
    });

    this.router.param(String(name), (req: Request, res: Response, next: NextFunction, param) => {
      res.locals[name] =
        type === "string"
          ? String(param)
          : type === "number"
            ? Number(param)
            : param;
      if (
        (type === "string" && _.isString(res.locals[name])) ||
        (type === "number" && _.isNumber(res.locals[name])) ||
        !type
      ) {
        if (_.isFunction(doIt)) doIt(res);
        next();
      } else res.status(500).json(`:${name} has to be a ${type}`);
    });

    return this;
  }

  build() {

    this.allRoutes.map((route: SuperRoute) => {

      let routeMethods = route.methods;
      if (this.addMiddlewares && _.isFunction(this.addMiddlewares)) {
        this.addMiddlewares(route, routeMethods);
      }

      routeMethods.unshift( (req:Request, res:Response, next:NextFunction) => {
        res.locals.pathDatas = this.pathDatas
        next()
      });
      // routeMethods.push(genericMiddlewares.socket);
      // routeMethods.push(genericMiddlewares.stop);

      // logger.log(routeMethods)

      this.routes_by_method[route.method.toLowerCase()] =
        this.routes_by_method[route.method.toLowerCase()] || {};
      this.routes_by_method[route.method][route.route] = {
        name: route.name,
        description: route.description,
        public: route.public || false,
        basic: route.basic || false, // if basic, you don't need any acces or right to call this route
        token: route.token || false,
        entity: route.entity || false,
        guards : route.guards || [],
        route: route.route,
        group: route.group,
        module: route.module || "no module",
        parameters: route.parameters || [],
        contentType: route.contentType,
        schema: route.schema,
      };
      const check = routeMethods.filter((x) => typeof x !== "function");
      if (check.length > 0) {
        logger.log(
          `The route ${route.route} has method which is not a function`
        );
      } else {
        this.router.route([route.route])[route.method](routeMethods);
      }
    });

    const routes: any = [];
    _.each(this.routes_by_method, (_routes, method) => {
      _.each(_routes, (route, url) => {
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
      this.buildDocumentation().then(() => {
        if (this.log)
          logger.info(
            `SuperRouter Documentation generated ${this.documentation}`
          );
        this.app.use(
          `${this.prefix}/documentation`,
          swaggerUi.serve,
          swaggerUi.setup(require(this.documentation), {
            explorer: true,
          })
        );
      });
    }

    if (this.log) {
      logger.info(`SuperRouter has ${this.allRoutes.length} routes`);
      logger.info(`RouteJson file is ${this.routesJSON}`);
    }

    return this;
  }

  scan() {
    this.scanAppHost();
    this.scanData();
    return this;
  }

  scanAppHost() {
    if (this.log) {
      logger.info(`scanAppHost ${this.pathAppHost}`)
    }
    glob
      //search all files with js extension
      .sync(this.pathAppHost, { ignore: [""], cwd: `${this.root}/` })
      //map all files found above and return an array with all the exported objects from all the files
      .map((filename) => require(`${filename}`))
      .map((routes) => {
        const _routes = routes.default

        //ROUTES
        if (_routes !== undefined && _.isArray(_routes) && _routes.length > 0) {
          this.allRoutes.push(..._routes);
        }

      });

    return this;
  }

  scanData() {
    glob
      .sync(this.pathDatas, { ignore: [""], cwd: `${this.root}/` })
      .map((filename) => require(`${filename}`))
      .map((Structure) => {

        let model:SuperModel
        try {
          const Model = Structure.default
          model = new Model();
        }
        catch( error ) {
          logger.error(`Try to create new Model for ${JSON.stringify(Structure)} but not works`)
          logger.info(`export class CLASSNAME extends GenericModel implements SuperModel`)
          logger.log(error)
        }

        if (_.isString(model.name) && model.name.length > 0) {


          model.token = Array.isArray(model.token) ? model.token : []

          const Controller = GenericControllers(model.alias);
          const prefix = model.route_prefix || "";

          const routes: Array<SuperRoute> = []

          if (model.readRoute) {
            routes.push({
              name: `get_all_${model.alias}`,
              description: `Get all instances of model ${model.alias}`,
              method: "get",
              route: `${prefix}${model.parent}/${model.name}`,
              methods: [Controller.get],
              token : model.token.indexOf("findall")>=0
            })
          }

          if (model.readRoute) {
            routes.push({
              name: `get_one_${model.alias}`,
              method: "get",
              description: `Get only one instance of model ${model.alias}`,
              route: `${prefix}${model.parent}/${model.name}/:focus`,
              methods: [Controller.get],
              token : model.token.indexOf("findone")>=0
            })
          }

          if (model.createRoute) {
            routes.push({
              name: `create_${model.alias}`,
              method: "post",
              description: `Create one instance of model ${model.alias}`,
              route: `${prefix}${model.parent}/${model.name}`,
              methods: [
                Controller.post,
                // Controller.get,
              ],
              token : model.token.indexOf("create")>=0
            })
          }

          if (model.updateRoute) {
            routes.push({
              name: `update_one_${model.alias}`,
              method: "put",
              description: `Update one instance of model ${model.alias}`,
              route: `${prefix}${model.parent}/${model.name}/:focus`,
              methods: [Controller.put, Controller.get],
              token : model.token.indexOf("update")>=0
            })
          }

          if (model.deleteRoute)
            routes.push({
              name: `delete_one_${model.alias}`,
              method: "delete",
              description: `Delete one instance of model ${model.alias}`,
              route: `${prefix}${model.parent}/${model.name}/:focus`,
              methods: [Controller.delete],
              token : model.token.indexOf("destroy")>=0
            })

          if (model.keepStory) {
            routes.push({
              name: `get_all_historic_${model.alias}`,
              description: `Get all historic of an instances of model ${model.alias}`,
              method: "get",
              route: `${prefix}${model.parent}/${model.name}_historics`,
              methods: [Controller.getHistoric],
              token : model.token.indexOf("historic")>=0
            });
          }

          routes.map((route: SuperRoute) => {
            route.cache = model.cache || false;
            route.guards = model.guards || [];
            route.public = model.public || false;
            route.module = model.alias;
            route.group = model.group;
            // route.entity = (model.parent && model.parent.length>0) || model.entity ? true : false
          });

          this.allRoutes.push(...routes);
        }
      });

    return this;
  }
}