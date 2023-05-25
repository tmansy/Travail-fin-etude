'use strict';

import { SuperRouter, momentLocaleFr, SuperMiddlewares, SuperStart, SuperStop, SuperSocket, SuperConfiguration, SuperErrorHandler } from 'super-rest-api';
import { colorConsole } from 'tracer';
import sourcemap from 'source-map-support';
import express from 'express';
import bodyParser from 'body-parser';
import * as http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import moment from 'moment';
import { program } from 'commander';
import path from 'path';
import { AuthControllers } from './middlewares/auth';

sourcemap.install();

const logger = colorConsole();

program
  .version('0.1.0')
  .option('-p, --port [portNumber]', 'Define the port on which the server will listen', 'portNumber')
  .parse(process.argv);

const app = express();
app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, type: 'application/x-www-from-urlencoding' }));

app.use(SuperMiddlewares.setHeader('X-Powered-By', 'tmansy'));

const server = http.createServer(app);
const io = new Server(server, {
    transports: ['websocket'],
});

app.use(SuperMiddlewares.Bind({ io: io }));
app.use(cors());

moment.locale('fr', momentLocaleFr);

// Démarrage serveur
SuperConfiguration.root = path.join(__dirname, 'dist/'),
new SuperRouter({
    app: app,
    log: true,
    root: path.join(__dirname, './'),
    prefix: '/api/v1',
    description: "Documentation of the R4N's API",
    title: 'R4N API',
    database: 'r4n',
    url_acc: 'https://api.r4n-acc.be',
    url_prod: 'https://api.r4n.be',
    addMiddlewares: (route: any, middlewares) => {
        // if(route.token) {
        //     middlewares.unshift(AuthControllers.account);
        //     middlewares.unshift(AuthControllers.token);
        // }
        middlewares.unshift(SuperStart);
        middlewares.push(SuperSocket);
        middlewares.push(SuperErrorHandler);
        middlewares.push(SuperStop);
    },
}).scan().build();

const port = 5555;
server.listen(port, () => {
    logger.log('Server is listening on http://%s:%s', 'localhost', port);
    var environment = app.get('env');
    logger.log('Your environment is : ' + environment);
});