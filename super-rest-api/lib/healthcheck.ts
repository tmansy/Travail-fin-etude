import { Request, Response } from "express";
import { colorConsole } from "tracer";
const logger = colorConsole()

const express = require("express");
const router = express.Router();
const async = require("async");
const _ = require("underscore");
const osu = require("node-os-utils");
const cpu = osu.cpu;
const drive = osu.drive;
const mem = osu.mem;
// var netstat = osu.netstat;

router.get("/healthCheck", (req:Request, res:Response) => {
  // optional: add further things to check (e.g. connecting to dababase)
  const resp:any = {};

  const headers = req.headers;
  // console.log(headers)

  async.waterfall(
    [
      (c:any) => {
        if (_.has(headers, "x-access")) {
          c();
        } else {
          resp.statusCode = 400;
          resp.message = `It lacks [x-access] header`;
          res.status(400).json(resp);
        }
      },
      (c:any) => {
        (resp.uptime = process.uptime()),
          (resp.message = "OK"),
          (resp.timestamp = Date.now()),
          (resp.cpu_count = cpu.count()),
          (resp.cpu_model = cpu.model()),
          (resp.cpu_load_average = cpu.loadavg()),
          cpu.usage().then((res:any) => {
            resp.cpu_percentage = res;
            c();
          });
      },
      (c:any) => {
        drive.info().then((res:any) => {
          resp.drive_informations = res;
          c();
        });
      },
      (c:any) => {
        mem.info().then((res:any) => {
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
    ],
    () => {
      try {
        resp.statusCode = 200;
        res.status(200).json(resp);
      } catch (e) {
        resp.statusCode = 503;
        resp.message = e;
        res.status(503).json(resp);
      }
    }
  );
});

module.exports = router;
