
import * as _ from "underscore";
import { SequelizeWarning } from "./sequelizeWarning";
import { ValidationErrorItem } from "sequelize";

import { colorConsole } from "tracer";
const logger = colorConsole()

const error = (e:any, req:any, res:any) => {
  let statusCode = 500;
  let message = [...res.message];

  logger.error(e);

  if (e && e.name === "SequelizeDatabaseError") {
    message.push(e.original.sqlMessage);
    statusCode = 520;
  } else if (e instanceof SequelizeWarning) {
    statusCode = 202;
    message.push(e.message);
  } else if (e instanceof Error) {
    statusCode = 500;
    message.push(e.message);
  } else if (e) {
    statusCode = 500;
    const errors = _.isArray(e.errors) ? e.errors : [];
    errors.map((error:any) => {
      if (error instanceof ValidationErrorItem) {
        message.push(error.message);
      } else {
        logger.log(error);
      }
    });
  }

  const answer = {
    statusCode: statusCode,
    message: message.length > 0 ? message.join(", ") : "Pas de message",
  };

  res.status(statusCode).json(answer);
};

module.exports = error;
