import path from "path";
import { Database } from "super-rest-api";
import * as async from "async";
import { colorConsole } from "tracer";

const logger = colorConsole()

const thepath = path.join(__dirname, '../dist/data/*.js');
const db = new Database('db').scan(thepath);
    async.waterfall([
        (callback) => {
        db.root_sequelize.query('SET FOREIGN_KEY_CHECKS = 0;')
            .then(() => {
                callback(null)
            }).catch(err => {
                logger.log(err)
                callback(err)
            })
        },
        (callback) => {
            db["Teams"].sync({
                alter: true,
                logging: console.log,
            }).then(() => {
                logger.log("Fini");
                callback(null);
            }).catch((err) => {
                logger.error(err);
            })
        },
        (callback) => {
            db["Users_Teams"].sync({
                alter: true,
                logging: console.log,
            }).then(() => {
                logger.log("Fini");
                callback(null);
            }).catch((err) => {
                logger.error(err);
            })
        },
        (callback) => {
            db["Users"].sync({
                alter: true,
                logging: console.log,
            }).then(() => {
                logger.log("Fini");
                callback(null);
            }).catch((err) => {
                logger.error(err);
            })
        },
        (callback) => {
            db["MembershipRequests"].sync({
                alter: true,
                logging: console.log,
            }).then(() => {
                logger.log("Fini");
                callback(null);
            }).catch((err) => {
                logger.error(err);
            })
        },
        (callback) => {
            db['Messages'].sync({
                alter: true,
                logging: console.log,
            }).then(() => {
                logger.log("Fini");
                callback(null);
            }).catch((err) => {
                logger.error(err);
            })
        },
        (callback) => {
            db['Carts'].sync({
                alter: true,
                logging: console.log,
            }).then(() => {
                logger.log("Fini");
                callback(null);
            }).catch((err) => {
                logger.error(err);
            })
        },
        (callback) => {
            db['Carts_Products'].sync({
                alter: true,
                logging: console.log,
            }).then(() => {
                logger.log("Fini");
                callback(null);
            }).catch((err) => {
                logger.error(err);
            })
        },
        (callback) => {
            db['Orders'].sync({
                alter: true,
                logging: console.log,
            }).then(() => {
                logger.log("Fini");
                callback(null);
            }).catch((err) => {
                logger.error(err);
            })
        },
        (callback) => {
            db.root_sequelize.query('SET FOREIGN_KEY_CHECKS = 1;')
            .then(() => {
                callback(null)
            }).catch(err => {
                logger.log(err)
                callback(err)
            })
        }
    ], () => {
        logger.trace(`DONE!!!!`);
});