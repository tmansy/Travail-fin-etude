"use strict";
// certbot certonly --standalone -d api.imome.myinforius.be
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SuperProxy = void 0;
var tracer_1 = require("tracer");
var http_proxy_1 = __importDefault(require("http-proxy"));
var http_1 = __importDefault(require("http"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var logger = (0, tracer_1.colorConsole)();
var SuperProxy = /** @class */ (function () {
    function SuperProxy(urls) {
        var _this = this;
        //Create a proxy instance
        this.proxy = http_proxy_1["default"].createProxyServer({
            changeOrigin: true
        });
        // On crée un serveur général qui écoute sur le port 80 (port de base pour protocol http)
        // Pour TOUTES les requêtes qui arrivent sur le port 80, on les redirige en port 443 => SSL
        this.http_server = http_1["default"].createServer(function (req, res) {
            var url = req.headers['host'] + req.url;
            logger.log("http zone, redirection to : ".concat(url));
            res.writeHead(301, { "Location": "https://" + url });
            res.end();
        });
        // On créer le serveur SSL (443)
        // En options, on passe les certificats SSL
        // Pour chaque nom de domaine, on utilise le proxy pour changer de port, c'est tout :) 
        this.https_server = https_1["default"].createServer({
            cert: fs_1["default"].readFileSync(path_1["default"].join(process.env.HTTPS, 'fullchain.pem')),
            key: fs_1["default"].readFileSync(path_1["default"].join(process.env.HTTPS, 'privkey.pem'))
        }, function (req, res) {
            // logger.log(req.headers)
            var host = req.headers.host;
            var isWS = req.headers['upgrade'] === 'websocket';
            logger.log("https zone : " + host + " => socket ? " + isWS);
            if (isWS) {
                // Pour le moment, on ne fait rien ... 
                // port = 5555
                // var url = 'http://localhost:'+port
                // return proxy.web(req, res, {target: url, ws:true});
            }
            else if (urls.indexOf(host) >= 0) {
                var port = 5555;
                return _this.proxy.web(req, res, { target: "http://localhost:".concat(port) });
            }
            else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Requested resource is not available');
            }
        });
        this.proxy.on("error", function (error) {
            logger.error(error);
        });
        // Tu touches à ce qui est ici dessous et t'es mort ! :D 
        // Ca permet de gérer les sockets 
        this.https_server.on('upgrade', function (req, socket, head) {
            _this.proxy.ws(req, socket, head, { target: 'http://localhost:5555' });
        });
        this.https_server.listen(443);
        this.http_server.listen(80);
    }
    return SuperProxy;
}());
exports.SuperProxy = SuperProxy;
//# sourceMappingURL=SuperProxy.js.map