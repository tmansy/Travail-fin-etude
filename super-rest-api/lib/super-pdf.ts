const exec = require("child_process").exec;


import * as _ from "underscore";

export class SuperPDF {

  public files:Array<string> = []
  public outputFile:string

  constructor(outputFile:string) {
    this.outputFile = "output.pdf";
    this.outputFile =
      _.isString(outputFile) && outputFile.length > 0
        ? outputFile
        : this.outputFile;
    return this;
  }

  add(filename:string|Array<string>) {
    if (Array.isArray(filename) && filename.length > 0) {
      this.files.push(...filename);
    } else if ( typeof(filename) === "string") {
      const _filename:string = filename
      this.files.push(_filename);
    }
    return this;
  }

  merge() {
    // apt install poppler-utils
    const files = this.files.join(" ");
    const command = `pdfunite ${files} ${this.outputFile}`;
    return new Promise((resolve, reject) => {
      exec(command, (error:any, stdout:any, stderr:any) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

}
