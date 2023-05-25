import { colorConsole } from 'tracer';
import httpProxy from 'http-proxy';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

const logger = colorConsole();

export class SuperProxy {
    public http_server;
    public https_server;
    public proxy = httpProxy.createProxyServer({
        changeOrigin: true,
        agent: http.globalAgent
    });
    
    constructor(urls: string[]) {
        this.http_server = http.createServer((req, res) => {
            const host = req.headers.host;
            if(urls.indexOf(host) >= 0) {
                let url = host + req.url;
                logger.log(`http zone, redirection to : ${url}`);
                res.writeHead(301, { "Location": "https://" + url });
                res.end();
            }
            else {
                res.end();
            }
        });

        this.https_server = https.createServer({
            cert: fs.readFileSync(path.join(process.env.HTTPS, 'fullchain.pem')),
            key: fs.readFileSync(path.join(process.env.HTTPS, 'privkey.pem')),
        }, (req, res) => {
            logger.log(req.headers);
            const host = req.headers.host;
            const isWS = req.headers['upgrade'] === 'websocket';
            logger.log('https zone : ' + host + " => socket ? " + isWS);

            if(isWS) {

            }
            else if(urls.indexOf(host) >= 0) {
                const port = 5555;
                return this.proxy.web(req, res, { target: `http://localhost:${port}` });
            }
            else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Requested resource is not available');
            }
        });

        this.proxy.on("error", (error) => {
            logger.error(error);
        });

        this.https_server.on('upgrade', (req, socket, head) => {
            this.proxy.ws(req, socket, head, { target: 'http://localhost:5555' });
        });

        this.http_server.listen(80);
        this.https_server.listen(443);
    }
}

new SuperProxy([
    "api.r4n-acc.be",
    "api.r4n.be"
]);