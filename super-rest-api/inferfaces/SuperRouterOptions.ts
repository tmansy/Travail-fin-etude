import { Express } from "express";
import { SuperRoute } from "..";
export interface SuperRouterOptions {
  log:boolean
  description?:string;
  generateDocumentation?:boolean;
  pathSwagger?:string;
  title?:string;
  database?:string;
  url_prod?:string;
  url_acc?:string;
  addMiddlewares?:(router:SuperRoute, middlewares:any[] ) => void;
  root?:string;
  pathDatas?:string;
  pathAppHost?:string;
  app?:Express;
  allRoutes?:string;
  parameters?:string;
  routes_by_method?:string;
  router?:string;
  documentation?:string;
  routesJSON?:string;
  prefix:string;
}