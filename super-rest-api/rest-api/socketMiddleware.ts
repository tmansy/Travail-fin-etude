import { colorConsole } from "tracer";
const logger = colorConsole()
import * as _ from "underscore";

module.exports = (req:any, res:any, next:any) => {
  const params = req.query;
  logger.error("SocketMiddleware " + req.originalUrl);
  if (
    _.has(params, "socket") &&
    params.socket.length > 0 &&
    params.socket !== "true"
  ) {
    // logger.error("I will send socket with : ")
    req.app.io.emit(params.socket, res.response);
  }
  next();
};
