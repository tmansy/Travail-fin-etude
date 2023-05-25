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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.SuperPDF = void 0;
var exec = require("child_process").exec;
var _ = __importStar(require("underscore"));
var SuperPDF = /** @class */ (function () {
    function SuperPDF(outputFile) {
        this.files = [];
        this.outputFile = "output.pdf";
        this.outputFile =
            _.isString(outputFile) && outputFile.length > 0
                ? outputFile
                : this.outputFile;
        return this;
    }
    SuperPDF.prototype.add = function (filename) {
        var _a;
        if (Array.isArray(filename) && filename.length > 0) {
            (_a = this.files).push.apply(_a, __spreadArray([], __read(filename), false));
        }
        else if (typeof (filename) === "string") {
            var _filename = filename;
            this.files.push(_filename);
        }
        return this;
    };
    SuperPDF.prototype.merge = function () {
        // apt install poppler-utils
        var files = this.files.join(" ");
        var command = "pdfunite ".concat(files, " ").concat(this.outputFile);
        return new Promise(function (resolve, reject) {
            exec(command, function (error, stdout, stderr) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(true);
                }
            });
        });
    };
    return SuperPDF;
}());
exports.SuperPDF = SuperPDF;
//# sourceMappingURL=super-pdf.js.map