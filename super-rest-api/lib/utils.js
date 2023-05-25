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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SuperTools = void 0;
var _ = __importStar(require("underscore"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var HTML_entities_1 = __importDefault(require("./HTML.entities"));
var tracer_1 = require("tracer");
var logger = (0, tracer_1.colorConsole)();
function utf8Encode(unicodeString) {
    if (typeof unicodeString != "string")
        throw new TypeError("parameter 'unicodeString' is not a string");
    var utf8String = unicodeString
        .replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
    function (c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | (cc >> 6), 0x80 | (cc & 0x3f));
    })
        .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
    function (c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xe0 | (cc >> 12), 0x80 | ((cc >> 6) & 0x3f), 0x80 | (cc & 0x3f));
    });
    return utf8String;
}
function encrypt(value, secretKey) {
    if (secretKey === void 0) { secretKey = ""; }
    var encryptor = require("simple-encryptor")(secretKey);
    return encryptor.encrypt(value);
}
function decrypt(value, secretKey) {
    if (secretKey === void 0) { secretKey = ""; }
    var encryptor = require("simple-encryptor")(secretKey);
    var val;
    try {
        val = encryptor.decrypt(value);
    }
    catch (e) {
        val = null;
    }
    return val;
}
var checkEnvArray = function (variables) {
    variables = Array.isArray(variables) ? variables : [];
    var p = process.env;
    var error = function (v) {
        return "It lacks ".concat(v, " ! do > set ").concat(v, "=var (on windows) or > export ").concat(v, "=var (on linux)");
    };
    for (var i = 0; i < variables.length; i++) {
        var v = variables[i];
        if (!p[v]) {
            console.error(error(v));
        }
    }
};
var checkBase64 = function (opts) {
    if (opts === void 0) { opts = {}; }
    var regex = '(?:[A-Za-z0-9+\/]{4}\\n?)*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)';
    return opts.exact ? new RegExp('(?:^' + regex + '$)') : new RegExp('(?:^|\\s)' + regex, 'g');
};
exports.SuperTools = {
    checkBase64: checkBase64,
    utf8Encode: utf8Encode,
    encrypt: encrypt,
    decrypt: decrypt,
    checkEnvArray: checkEnvArray,
    checkEnv: function () {
        var variables = [
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
    getMostRecentFileName: function (dir, type) {
        if (type === void 0) { type = ""; }
        var files = fs.readdirSync(dir);
        if (type) {
            files = files.filter(function (x) { return x.endsWith(type); });
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
    capitalize: function (string) {
        return string && string.charAt(0).toUpperCase() + string.slice(1);
    },
    sanitizeName: function (chaine) {
        var tab1 = " 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ-";
        var tab2 = "__aaaaaaaaaaaaooooooooooooeeeeeeeecciiiiiiiiuuuuuuuuynn_";
        var rep1 = tab1.split("");
        var rep2 = tab2.split("");
        var myarray = [];
        _.each(rep1, function (rep, i) {
            myarray[rep] = rep2[i];
        });
        myarray["Œ"] = "OE";
        myarray["œ"] = "oe";
        chaine = chaine.replace(/\//g, "_").replace(/\\/g, "_");
        return chaine.replace(/./g, function ($0) {
            return myarray[$0] ? myarray[$0] : $0;
        });
    },
    decodeHex: function (text) {
        if (_.isString(text) && text.length > 0) {
            var entities = HTML_entities_1["default"];
            for (var i = 0, max = entities.length; i < max; ++i)
                text = text.replace(new RegExp(entities[i].code, "g"), entities[i].value);
            return text;
        }
        else
            return text;
    },
    getMatches: function (string, regex, index) {
        index || (index = 1); // default to the first capturing group
        var matches = [];
        var match;
        while ((match = regex.exec(string))) {
            matches.push(match[index]);
        }
        return matches;
    },
    getRandomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    sanitizeHtml: function (html) {
        return html.replace(/<[\s\S]*?>/gi, "");
    },
    randomString: function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    SuperSorter: function (fields) { return function (a, b) { return fields.map(function (o) {
        var dir = 1;
        if (o[0] === '-') {
            dir = -1;
            o = o.substring(1);
        }
        return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
    }).reduce(function (p, n) { return p ? p : n; }, 0); }; }
};
//# sourceMappingURL=utils.js.map