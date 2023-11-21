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
import jwt from "jsonwebtoken";
import { program } from 'commander';
import path from 'path';
import { AuthControllers } from './middlewares/auth';
import { ChatControllers } from './middlewares/chat';

sourcemap.install();

const logger = colorConsole();
const connectedUsers = new Set();


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
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST'],
    }
});

app.use(SuperMiddlewares.Bind({ io: io }));
app.use(cors({
    origin: ['http://localhost:4200', 'http://requiemforanoob.be/'],
}));


moment.locale('fr', momentLocaleFr);

io.use((socket, next) => {
    try {
        let token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Token non fourni'));
        }
        else if(token.startsWith("bearer") || token.startsWith("Bearer") ) {
            token = token.substring(6).trim();
        }

        jwt.verify(token, `${process.env.SECRET_KEY}`, (err, decoded) => {
            if (err) return next(new Error('Token invalide'));
            return next();
        });
    } catch (error) {
        return next(new Error('Impossible de vérifier le token'));
    }
});

io.on('connection', (socket) => {
    socket.on('sendMessage', (data) => {
        ChatControllers.sendMessage(data).then((newMessage) => {
            io.emit('newMessage', newMessage);
        });
    });

    socket.on('getAllMessages', async (data) => {
        const messages = await ChatControllers.getAllMessages(data);

        io.emit('returnAllMessages', messages);
    });

    socket.on('userConnected', (userId) => {
        connectedUsers.add(userId);
        io.emit('returnConnectedUsers', Array.from(connectedUsers));
    });

    socket.on('userDisconnect', (userId) => {
        connectedUsers.delete(userId);
        io.emit('returnConnectedUsers', Array.from(connectedUsers));
    });
});

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
        if(route.hasToken) {
            middlewares.unshift(AuthControllers.token);
        }
        middlewares.unshift(SuperStart);
        middlewares.push(SuperSocket);
        middlewares.push(SuperErrorHandler);
        middlewares.push(SuperStop);
    },
}).addParam({
    name: 'focus',
    type: 'number',
    description: 'it\'s an id',
}).scan().build();

const port = 5555;
server.listen(port, () => {
    logger.log('Server is listening on http://%s:%s', 'localhost', port);
    var environment = app.get('env');
    logger.log('Your environment is : ' + environment);
});