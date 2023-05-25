
import fs from 'fs';
import path from 'path';
import async from 'async';
import _, { reject } from "underscore";
import { Subject } from 'rxjs';
import { exec } from "child-process-promise";
import { colorConsole } from 'tracer';

const logger = colorConsole({})

export interface pdf2ImgOutput {
  base64: string;
  path: string;
  index: number;
}

export interface pdf2ImgOptions {
  type?: "png" | "jpeg"
  size?: number
  density?: number
  outputdir?: string
  outputname?: string
  page?: string
  start?: number
  quality?: number
  atSameTime?: number
  logs?:boolean
}

export class SuperPdfToImg {

  public type: "png" | "jpeg" = "jpeg"
  public size = 1024
  public density = 600
  public quality = 100
  public outputdir = null
  public outputname = "input"
  public page = null
  public start = 1
  public atSameTime = 1
  public logs = false 

  constructor(opts?: pdf2ImgOptions) {
    this.type = opts?.type || this.type;
    this.size = opts?.size || this.size;
    this.density = opts?.density || this.density;
    this.outputdir = opts?.outputdir || this.outputdir;
    this.outputname = opts?.outputname || this.outputname;
    this.page = opts?.page || this.page;
    this.start = opts?.start || this.start;
    this.atSameTime = opts?.atSameTime || this.atSameTime;
    this.quality = opts && opts.quality > 0 && opts.quality <= 100 ? opts.quality : this.quality;
    this.logs = this.logs || false 
    return this
  }

  private range = (lowEnd: number, highEnd: number) => {
    var list = [];
    for (var i = lowEnd; i <= highEnd; i++) {
      list.push(i);
    }
    return list
  }

  public countPages = (input: string): Promise<any> => {
    const command = `qpdf --show-npages "${input}"`
    return new Promise((resolve, reject) => {
      exec(command).then((res) => {

        if (res.stderr) {
          logger.error(res)
          reject(new Error(res))
        }
        else if (res.stdout) {

          const pageCount = res.stdout && _.last(res.stdout.toString().match(/[0-9]+/g))
          if (!pageCount) {
            reject(new Error('Invalid page number.'));
          }
          else {
            resolve(pageCount)
          }
        }

      }).catch(err => {
        reject(err);
      })
    })
  }

  public convertPage = (input: string, page: number): Promise<pdf2ImgOutput> => {
    return new Promise((resolve, reject) => {
      const cmd = `pdftoppm -f ${page} -scale-to ${this.size} -l ${page} -${this.type} -rx ${this.density} -ry ${this.density} "${input}" "${this.outputdir}/${this.outputname}"`
      console.log(cmd)
      exec(cmd).then((res) => {
        const theImages = fs.readdirSync(this.outputdir)
        console.log(theImages)
        const theImage = theImages.filter(x => x.search(this.outputname) >= 0).filter(x => x.endsWith(".png")).find(x => x.search(String(page)) >= 0)
        const base64 = theImage ? fs.readFileSync(path.join(this.outputdir, theImage), { encoding: "base64" }) : ""
        const output: pdf2ImgOutput = {
          index: page,
          base64: base64,
          path: theImage ? path.join(this.outputdir, theImage) : "",
        }
        resolve(output)
      })
        .catch(err => {
          reject(err)
        })
    })
  }

  public convert = (input: string): Subject<any> => {

    const subject = new Subject<any>();
    let pages = []

    // Make sure it has correct extension
    if (path.extname(path.basename(input)) != '.pdf') {
      subject.next(new Error('Unsupported file type.'));
    }
    // Check if input file exists
    if (!fs.existsSync(input)) {
      subject.next(new Error('Input file not found.'));
    }

    var stdout = [];
    var output = path.basename(input, path.extname(path.basename(input)));

    // Set output dir
    if (this.outputdir) {
      this.outputdir = this.outputdir + path.sep;
    } else {
      this.outputdir = output + path.sep;
    }

    // Create output dir if it doesn't exists
    if (!fs.existsSync(this.outputdir)) {
      fs.mkdirSync(this.outputdir);
    }

    // Set output name
    if (this.outputname) {
      this.outputname = this.outputname;
    } else {
      this.outputname = output;
    }

    async.waterfall([
      // Get pages count
      (callback) => {

        this.countPages(input).then( (pageCount) => {

           // Convert selected page
           if (+this.page >= 0 && this.page !== null) {
            if (+this.page < +pageCount) {
              pages = [this.page]
              callback(null);
            } else {
              subject.next(new Error('Invalid page number. Selected page must be below than total page.'));
            }
          }
          else if (+this.start > 1) {
            if (+this.start <= +pageCount) {
              logger.log(` ${+this.start} / ${+this.page}`)
              pages = this.range(+this.start, +pageCount)
              callback(null);
            } else {
              logger.error('Invalid page number. First page must be below than total page.')
              subject.complete();
            }
          }
          else {
            pages = this.range(1, +pageCount)
            callback();
          }

        } )
        .catch( err => {
          subject.next( new Error( err) )
        })

      },

      // Convert pdf file
      (callback) => {

        async.eachLimit(pages, this.atSameTime, (page, nextPage) => {
          // const image = `${this.outputdir}${this.outputname}-${String(page).padStart(3, "0")}.${this.type}`

          this.convertPage(input, page).then((output: pdf2ImgOutput) => {
            subject.next(output)
            nextPage()
          })

        }, () => {
          callback()
        })

      },

    ], () => {
      subject.complete()
    });

    return subject

  }


}
