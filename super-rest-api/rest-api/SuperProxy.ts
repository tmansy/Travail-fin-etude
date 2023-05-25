// certbot certonly --standalone -d api.imome.myinforius.be


import { colorConsole } from "tracer"
import httpProxy from 'http-proxy';
import http from "http"
import https from "https"
import fs from "fs"
import path from "path"
const logger = colorConsole()

export class SuperProxy {

    //Create a proxy instance
    public proxy = httpProxy.createProxyServer({
        changeOrigin: true,
    });

    // On crée un serveur général qui écoute sur le port 80 (port de base pour protocol http)
    // Pour TOUTES les requêtes qui arrivent sur le port 80, on les redirige en port 443 => SSL
    public http_server = http.createServer((req, res) => {
        let url = req.headers['host'] + req.url;
        logger.log(`http zone, redirection to : ${url}`)
        res.writeHead(301, { "Location": "https://" + url });
        res.end();
    })

    public https_server

    constructor(urls:string[]) {

        // On créer le serveur SSL (443)
        // En options, on passe les certificats SSL
        // Pour chaque nom de domaine, on utilise le proxy pour changer de port, c'est tout :) 
        this.https_server = https.createServer(
            {
                cert: fs.readFileSync(path.join(process.env.HTTPS, 'fullchain.pem')),
                key: fs.readFileSync(path.join(process.env.HTTPS, 'privkey.pem')),
            },
            (req, res) => {

                // logger.log(req.headers)

                const host = req.headers.host
                const isWS = req.headers['upgrade'] === 'websocket'

                logger.log("https zone : " + host + " => socket ? " + isWS)

                if (isWS) {
                    // Pour le moment, on ne fait rien ... 
                    // port = 5555
                    // var url = 'http://localhost:'+port
                    // return proxy.web(req, res, {target: url, ws:true});
                }
                else if (urls.indexOf(host) >= 0) {
                    const port = 5555
                    return this.proxy.web(req, res, { target: `http://localhost:${port}` });
                }
                else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Requested resource is not available');
                }

            }
        )

        this.proxy.on("error", (error) => {
            logger.error(error)
        });

        // Tu touches à ce qui est ici dessous et t'es mort ! :D 
        // Ca permet de gérer les sockets 
        this.https_server.on('upgrade', (req, socket, head) => {
            this.proxy.ws(req, socket, head, { target: 'http://localhost:5555' });
        });

        this.https_server.listen(443);
        this.http_server.listen(80);
    }

}

