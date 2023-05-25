"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.Pm2Monitor = void 0;
var exec = require("child-process-promise").exec;
var osu = require("node-os-utils");
var cpu = osu.cpu;
var drive = osu.drive;
var mem = osu.mem;
var os = osu.os;
var tracer_1 = require("tracer");
var logger = (0, tracer_1.colorConsole)();
var async = __importStar(require("async"));
var fs = __importStar(require("fs"));
var moment = require("moment");
var Pm2Monitor = /** @class */ (function () {
    function Pm2Monitor(data) {
        if (data === void 0) { data = {}; }
        var _this = this;
        this.log = false;
        this.log = false;
        this.outputPath = data.outputPath;
        this.app = data.app;
        this.name = data.name;
        if (data.log) {
            this.log = data.log;
            logger.log(data);
        }
        if (!(String(this.outputPath).length > 0)) {
            throw new Error("You must define data.path an absolute path for the json output");
        }
        if (!this.app) {
            throw new Error("You must define data.app as express()");
        }
        this.app.get("/pm2json", function (req, res) {
            res.sendFile(_this.outputPath);
        });
    }
    Pm2Monitor.prototype.scan = function (interval) {
        var _this = this;
        if (interval === void 0) { interval = 5; }
        if (this.log) {
            logger.log("start pm2 status");
        }
        var report = {
            name: this.name || "noName",
            ip: os.ip(),
            hostname: os.hostname(),
            cpu_count: cpu.count(),
            cpu_model: cpu.model(),
            cpu_load_average: cpu.loadavg(),
            timestamp: moment().format("DD/MM/YYYY HH:mm:ss")
        };
        async.parallel([
            function (callback) {
                cpu.usage().then(function (cpuPercentage) {
                    report.cpu_pc = cpuPercentage;
                    callback();
                });
            },
            function (callback) {
                drive.info().then(function (info) {
                    report.drive = info;
                    callback();
                });
            },
            function (callback) {
                mem.info().then(function (info) {
                    report.memory = info;
                    callback();
                });
            },
            function (callback) {
                exec("node -v").then(function (res) {
                    report.node_version = res.stdout;
                    callback();
                });
            },
            function (callback) {
                exec("pm2 status")
                    .then(function (res) {
                    if (_this.log) {
                        logger.log(res);
                    }
                    // ┌─────┬───────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
                    // │ id  │ name      │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
                    // ├─────┼───────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
                    // │ 1   │ proxy     │ default     │ 1.0.0   │ fork    │ 301213   │ 76m    │ 37   │ online    │ 0%       │ 56.1mb   │ root     │ disabled │
                    // │ 0   │ server    │ default     │ 1.0.0   │ fork    │ 301197   │ 76m    │ 1779 │ online    │ 0%       │ 159.6mb  │ root     │ disabled │
                    // └─────┴───────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
                    var stdout = res.stdout.split("────┤");
                    var args = stdout[0]
                        .split("│")
                        .map(function (x) { return x.replace(/ /gi, ""); });
                    var apps = stdout[1]
                        .split("\n")
                        .filter(function (x) { return String(x).length > 0 && String(x).startsWith("│ "); });
                    var process = apps.map(function (app) {
                        var data = String(app).split("│");
                        data.shift();
                        data.pop();
                        data = data.map(function (x) { return x.replace(/ /gi, ""); });
                        //   logger.log(data)
                        var temp = {};
                        data.map(function (x, i) {
                            temp[args[i + 1]] = x;
                        });
                        return temp;
                    });
                    report.process = process;
                    callback();
                })["catch"](function (err) {
                    callback(err);
                });
            },
        ], function (err) {
            if (err) {
                if (_this.log) {
                    logger.log(err);
                }
                report.error = err;
            }
            if (_this.log) {
                logger.log("writeFileSync in ".concat(_this.outputPath));
            }
            fs.writeFileSync(_this.outputPath, JSON.stringify(report, null, 4));
            setTimeout(function () {
                _this.scan(interval);
            }, interval * 1000);
        });
    };
    return Pm2Monitor;
}());
exports.Pm2Monitor = Pm2Monitor;
//# sourceMappingURL=pm2-monitor.js.map