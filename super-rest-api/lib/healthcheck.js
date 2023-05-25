"use strict";
exports.__esModule = true;
var tracer_1 = require("tracer");
var logger = (0, tracer_1.colorConsole)();
var express = require("express");
var router = express.Router();
var async = require("async");
var _ = require("underscore");
var osu = require("node-os-utils");
var cpu = osu.cpu;
var drive = osu.drive;
var mem = osu.mem;
// var netstat = osu.netstat;
router.get("/healthCheck", function (req, res) {
    // optional: add further things to check (e.g. connecting to dababase)
    var resp = {};
    var headers = req.headers;
    // console.log(headers)
    async.waterfall([
        function (c) {
            if (_.has(headers, "x-access")) {
                c();
            }
            else {
                resp.statusCode = 400;
                resp.message = "It lacks [x-access] header";
                res.status(400).json(resp);
            }
        },
        function (c) {
            (resp.uptime = process.uptime()),
                (resp.message = "OK"),
                (resp.timestamp = Date.now()),
                (resp.cpu_count = cpu.count()),
                (resp.cpu_model = cpu.model()),
                (resp.cpu_load_average = cpu.loadavg()),
                cpu.usage().then(function (res) {
                    resp.cpu_percentage = res;
                    c();
                });
        },
        function (c) {
            drive.info().then(function (res) {
                resp.drive_informations = res;
                c();
            });
        },
        function (c) {
            mem.info().then(function (res) {
                resp.mem_informations = res;
                c();
            });
        },
        // c => {
        //     const db = require("./buildDatabases")()
        //     logger.log(db)
        // }
        // c => {
        //     netstat.stats().then(res => {
        //         resp.network_informations = res
        //         c()
        //     })
        // },
        // c => {
        //     netstat.inOut().then(res => {
        //         resp.network_in_out = res
        //         c()
        //     })
        // }
    ], function () {
        try {
            resp.statusCode = 200;
            res.status(200).json(resp);
        }
        catch (e) {
            resp.statusCode = 503;
            resp.message = e;
            res.status(503).json(resp);
        }
    });
});
module.exports = router;
//# sourceMappingURL=healthcheck.js.map