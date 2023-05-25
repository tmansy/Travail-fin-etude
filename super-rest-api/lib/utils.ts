
import * as _ from "underscore";
import * as path from "path";
import * as fs from "fs";
import HTMLEntities from "./HTML.entities";
import { colorConsole } from "tracer";
const logger = colorConsole()


function utf8Encode(unicodeString: string) {
  if (typeof unicodeString != "string")
    throw new TypeError("parameter 'unicodeString' is not a string");
  const utf8String = unicodeString
    .replace(
      /[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function (c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | (cc >> 6), 0x80 | (cc & 0x3f));
      }
    )
    .replace(
      /[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function (c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(
          0xe0 | (cc >> 12),
          0x80 | ((cc >> 6) & 0x3f),
          0x80 | (cc & 0x3f)
        );
      }
    );
  return utf8String;
}

function encrypt(value: any, secretKey = "") {
  const encryptor = require("simple-encryptor")(secretKey);
  return encryptor.encrypt(value);
}

function decrypt(value: any, secretKey = "") {
  const encryptor = require("simple-encryptor")(secretKey);
  var val;
  try {
    val = encryptor.decrypt(value);
  } catch (e) {
    val = null;
  }
  return val;
}

const checkEnvArray = (variables: any) => {
  variables = Array.isArray(variables) ? variables : [];
  const p = process.env;
  const error = (v: any) => {
    return `It lacks ${v} ! do > set ${v}=var (on windows) or > export ${v}=var (on linux)`;
  };
  for (let i = 0; i < variables.length; i++) {
    const v = variables[i];
    if (!p[v]) {
      console.error(error(v));
    }
  }
};

const checkBase64 = (opts: any = {}) => {
  var regex = '(?:[A-Za-z0-9+\/]{4}\\n?)*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)';
  return opts.exact ? new RegExp('(?:^' + regex + '$)') : new RegExp('(?:^|\\s)' + regex, 'g');
}

export const SuperTools = {

  checkBase64,
  utf8Encode,
  encrypt,
  decrypt,
  checkEnvArray,

  checkEnv: () => {
    const variables = [
      "SECRET_KEY",
      "NODE_ENV",
      "MYSQL_PREFIX",
      "MYSQL_USER",
      "MYSQL_PASSWORD",
    ];
    checkEnvArray(variables);
  },

  // resizeBase64OfSequelizeInstance: (
  //   instance,
  //   arg = "picture",
  //   width = 100,
  //   height = 100
  // ) => {
  //   var base64regex =
  //     /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  //   return new Promise((resolve, reject) => {
  //     const pic = instance[arg];
  //     const test = base64regex.test(pic);
  //     if (pic && typeof pic === "string" && pic.length > 0 && test) {
  //       resizeBase64(pic, width, height)
  //         .then((resized:any) => {
  //           instance[arg] = resized;
  //           resolve(true);
  //         })
  //         .catch((e:any) => {
  //           reject(e);
  //         });
  //     } else {
  //       delete instance[arg];
  //       resolve(true);
  //     }
  //   });
  // },

  getMostRecentFileName: (dir: string, type: string = "") => {
    var files = fs.readdirSync(dir);
    if (type) {
      files = files.filter((x: string) => x.endsWith(type));
    }

    logger.log(files);
    // use underscore for max()
    return _.max(files, function (f) {
      var fullpath = path.join(dir, f);

      // ctime = creation time is used
      // replace with mtime for modification time
      return fs.statSync(fullpath).ctime;
    });
  },

  capitalize: (string: string): string => {
    return string && string.charAt(0).toUpperCase() + string.slice(1);
  },

  sanitizeName: (chaine: string): string => {
    var tab1 = " 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ-";
    var tab2 = "__aaaaaaaaaaaaooooooooooooeeeeeeeecciiiiiiiiuuuuuuuuynn_";
    var rep1 = tab1.split("");
    var rep2 = tab2.split("");
    var myarray: any = [];
    _.each(rep1, (rep: any, i) => {
      myarray[rep] = rep2[i];
    });
    myarray["Œ"] = "OE";
    myarray["œ"] = "oe";

    chaine = chaine.replace(/\//g, "_").replace(/\\/g, "_");

    return chaine.replace(/./g, function ($0: any) {
      return myarray[$0] ? myarray[$0] : $0;
    });
  },

  decodeHex: (text: string) => {
    if (_.isString(text) && text.length > 0) {
      var entities = HTMLEntities;
      for (var i = 0, max = entities.length; i < max; ++i)
        text = text.replace(
          new RegExp(entities[i].code, "g"),
          entities[i].value
        );

      return text;
    } else return text;
  },

  getMatches: (string: string, regex: RegExp, index: number) => {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while ((match = regex.exec(string))) {
      matches.push(match[index]);
    }
    return matches;
  },

  getRandomInt: (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  sanitizeHtml: (html: string): string => {
    return html.replace(/<[\s\S]*?>/gi, "");
  },

  randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  SuperSorter: (fields) => (a, b) => fields.map(o => {
    let dir = 1;
    if (o[0] === '-') { dir = -1; o = o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
  }).reduce((p, n) => p ? p : n, 0),

};
