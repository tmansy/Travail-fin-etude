const exec = require("child-process-promise").exec;

const osu = require("node-os-utils");
const cpu = osu.cpu;
const drive = osu.drive;
const mem = osu.mem;
const os = osu.os;

import { colorConsole } from "tracer";
const logger = colorConsole()

import * as _ from "underscore";
import * as async from "async";
import * as fs from "fs";
import moment = require("moment");
import { Request, Response } from "express";

export class Pm2Monitor {

  public log = false 
  public outputPath:string 
  public app:any
  public name:string

  constructor(data:any = {}) {

    this.log = false;
    this.outputPath = data.outputPath;
    this.app = data.app;
    this.name = data.name;

    if (data.log) {
      this.log = data.log;
      logger.log(data);
    }

    if (!(String(this.outputPath).length > 0)) {
      throw new Error(
        `You must define data.path an absolute path for the json output`
      );
    }
    if (!this.app) {
      throw new Error(`You must define data.app as express()`);
    }

    this.app.get("/pm2json", (req:Request, res:Response) => {
      res.sendFile(this.outputPath);
    });
  }

  scan(interval = 5) {
    if (this.log) {
      logger.log(`start pm2 status`);
    }

    const report:any = {
      name: this.name || "noName",
      ip: os.ip(),
      hostname: os.hostname(),
      cpu_count: cpu.count(),
      cpu_model: cpu.model(),
      cpu_load_average: cpu.loadavg(),
      timestamp: moment().format("DD/MM/YYYY HH:mm:ss"),
    };

    async.parallel(
      [
        (callback) => {
          cpu.usage().then((cpuPercentage:any) => {
            report.cpu_pc = cpuPercentage;
            callback();
          });
        },
        (callback) => {
          drive.info().then((info:any) => {
            report.drive = info;
            callback();
          });
        },
        (callback) => {
          mem.info().then((info:any) => {
            report.memory = info;
            callback();
          });
        },
        (callback) => {
          exec(`node -v`).then((res:any) => {
            report.node_version = res.stdout;
            callback();
          });
        },
        (callback) => {
          exec(`pm2 status`)
            .then((res:any) => {
              if (this.log) {
                logger.log(res);
              }

              // ┌─────┬───────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
              // │ id  │ name      │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
              // ├─────┼───────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
              // │ 1   │ proxy     │ default     │ 1.0.0   │ fork    │ 301213   │ 76m    │ 37   │ online    │ 0%       │ 56.1mb   │ root     │ disabled │
              // │ 0   │ server    │ default     │ 1.0.0   │ fork    │ 301197   │ 76m    │ 1779 │ online    │ 0%       │ 159.6mb  │ root     │ disabled │
              // └─────┴───────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘

              const stdout = res.stdout.split("────┤");
              const args = stdout[0]
                .split("│")
                .map((x:string) => x.replace(/ /gi, ""));
              const apps = stdout[1]
                .split("\n")
                .filter(
                  (x:string) => String(x).length > 0 && String(x).startsWith("│ ")
                );
              const process = apps.map((app:string) => {
                let data = String(app).split("│");
                data.shift();
                data.pop();
                data = data.map((x) => x.replace(/ /gi, ""));
                //   logger.log(data)
                const temp:any = {};
                data.map((x, i) => {
                  temp[args[i + 1]] = x;
                });
                return temp;
              });

              report.process = process;
              callback();
            })
            .catch((err:any) => {
              callback(err);
            });
        },
      ],
      (err) => {
        if (err) {
          if (this.log) {
            logger.log(err);
          }
          report.error = err;
        }

        if (this.log) {
          logger.log(`writeFileSync in ${this.outputPath}`);
        }

        fs.writeFileSync(this.outputPath, JSON.stringify(report, null, 4));

        setTimeout(() => {
          this.scan(interval);
        }, interval * 1000);
      }
    );
  }
}

