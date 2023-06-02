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
        // (callback) => {
        //     db["Addresses"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Bills"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["BillStatus"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Bills_BillStatus"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Users"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },,
        // (callback) => {
        //     db["Cities"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Comments"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Countries"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["MembershipRequests"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["News"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Notes"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Orders"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Payments_PaymentStatus"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Payments"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["PaymentStatus"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        (callback) => {
            db["Players"].sync({
                alter: true,
                logging: console.log,
            }).then(() => {
                logger.log("Fini");
                callback(null);
            }).catch((err) => {
                logger.error(err);
            })
        },
        // (callback) => {
        //     db["Products_Orders"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Products"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Roles"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Sponsors_Teams"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Sponsors_Tournaments"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Sponsors"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Teams_Tournaments"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
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
        // (callback) => {
        //     db["Tournaments"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        // (callback) => {
        //     db["Trainings"].sync({
        //         alter: true,
        //         logging: console.log,
        //     }).then(() => {
        //         logger.log("Fini");
        //         callback(null);
        //     }).catch((err) => {
        //         logger.error(err);
        //     })
        // },
        (callback) => {
            db["Players_Teams"].sync({
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