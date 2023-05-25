"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SuperPdfToImg = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var async_1 = __importDefault(require("async"));
var underscore_1 = __importDefault(require("underscore"));
var rxjs_1 = require("rxjs");
var child_process_promise_1 = require("child-process-promise");
var tracer_1 = require("tracer");
var logger = (0, tracer_1.colorConsole)({});
var SuperPdfToImg = /** @class */ (function () {
    function SuperPdfToImg(opts) {
        var _this = this;
        this.type = "jpeg";
        this.size = 1024;
        this.density = 600;
        this.quality = 100;
        this.outputdir = null;
        this.outputname = "input";
        this.page = null;
        this.start = 1;
        this.atSameTime = 1;
        this.logs = false;
        this.range = function (lowEnd, highEnd) {
            var list = [];
            for (var i = lowEnd; i <= highEnd; i++) {
                list.push(i);
            }
            return list;
        };
        this.countPages = function (input) {
            var command = "qpdf --show-npages \"".concat(input, "\"");
            return new Promise(function (resolve, reject) {
                (0, child_process_promise_1.exec)(command).then(function (res) {
                    if (res.stderr) {
                        logger.error(res);
                        reject(new Error(res));
                    }
                    else if (res.stdout) {
                        var pageCount = res.stdout && underscore_1["default"].last(res.stdout.toString().match(/[0-9]+/g));
                        if (!pageCount) {
                            reject(new Error('Invalid page number.'));
                        }
                        else {
                            resolve(pageCount);
                        }
                    }
                })["catch"](function (err) {
                    reject(err);
                });
            });
        };
        this.convertPage = function (input, page) {
            return new Promise(function (resolve, reject) {
                var cmd = "pdftoppm -f ".concat(page, " -scale-to ").concat(_this.size, " -l ").concat(page, " -").concat(_this.type, " -rx ").concat(_this.density, " -ry ").concat(_this.density, " \"").concat(input, "\" \"").concat(_this.outputdir, "/").concat(_this.outputname, "\"");
                console.log(cmd);
                (0, child_process_promise_1.exec)(cmd).then(function (res) {
                    var theImages = fs_1["default"].readdirSync(_this.outputdir);
                    console.log(theImages);
                    var theImage = theImages.filter(function (x) { return x.search(_this.outputname) >= 0; }).filter(function (x) { return x.endsWith(".png"); }).find(function (x) { return x.search(String(page)) >= 0; });
                    var base64 = theImage ? fs_1["default"].readFileSync(path_1["default"].join(_this.outputdir, theImage), { encoding: "base64" }) : "";
                    var output = {
                        index: page,
                        base64: base64,
                        path: theImage ? path_1["default"].join(_this.outputdir, theImage) : ""
                    };
                    resolve(output);
                })["catch"](function (err) {
                    reject(err);
                });
            });
        };
        this.convert = function (input) {
            var subject = new rxjs_1.Subject();
            var pages = [];
            // Make sure it has correct extension
            if (path_1["default"].extname(path_1["default"].basename(input)) != '.pdf') {
                subject.next(new Error('Unsupported file type.'));
            }
            // Check if input file exists
            if (!fs_1["default"].existsSync(input)) {
                subject.next(new Error('Input file not found.'));
            }
            var stdout = [];
            var output = path_1["default"].basename(input, path_1["default"].extname(path_1["default"].basename(input)));
            // Set output dir
            if (_this.outputdir) {
                _this.outputdir = _this.outputdir + path_1["default"].sep;
            }
            else {
                _this.outputdir = output + path_1["default"].sep;
            }
            // Create output dir if it doesn't exists
            if (!fs_1["default"].existsSync(_this.outputdir)) {
                fs_1["default"].mkdirSync(_this.outputdir);
            }
            // Set output name
            if (_this.outputname) {
                _this.outputname = _this.outputname;
            }
            else {
                _this.outputname = output;
            }
            async_1["default"].waterfall([
                // Get pages count
                function (callback) {
                    _this.countPages(input).then(function (pageCount) {
                        // Convert selected page
                        if (+_this.page >= 0 && _this.page !== null) {
                            if (+_this.page < +pageCount) {
                                pages = [_this.page];
                                callback(null);
                            }
                            else {
                                subject.next(new Error('Invalid page number. Selected page must be below than total page.'));
                            }
                        }
                        else if (+_this.start > 1) {
                            if (+_this.start <= +pageCount) {
                                logger.log(" ".concat(+_this.start, " / ").concat(+_this.page));
                                pages = _this.range(+_this.start, +pageCount);
                                callback(null);
                            }
                            else {
                                logger.error('Invalid page number. First page must be below than total page.');
                                subject.complete();
                            }
                        }
                        else {
                            pages = _this.range(1, +pageCount);
                            callback();
                        }
                    })["catch"](function (err) {
                        subject.next(new Error(err));
                    });
                },
                // Convert pdf file
                function (callback) {
                    async_1["default"].eachLimit(pages, _this.atSameTime, function (page, nextPage) {
                        // const image = `${this.outputdir}${this.outputname}-${String(page).padStart(3, "0")}.${this.type}`
                        _this.convertPage(input, page).then(function (output) {
                            subject.next(output);
                            nextPage();
                        });
                    }, function () {
                        callback();
                    });
                },
            ], function () {
                subject.complete();
            });
            return subject;
        };
        this.type = (opts === null || opts === void 0 ? void 0 : opts.type) || this.type;
        this.size = (opts === null || opts === void 0 ? void 0 : opts.size) || this.size;
        this.density = (opts === null || opts === void 0 ? void 0 : opts.density) || this.density;
        this.outputdir = (opts === null || opts === void 0 ? void 0 : opts.outputdir) || this.outputdir;
        this.outputname = (opts === null || opts === void 0 ? void 0 : opts.outputname) || this.outputname;
        this.page = (opts === null || opts === void 0 ? void 0 : opts.page) || this.page;
        this.start = (opts === null || opts === void 0 ? void 0 : opts.start) || this.start;
        this.atSameTime = (opts === null || opts === void 0 ? void 0 : opts.atSameTime) || this.atSameTime;
        this.quality = opts && opts.quality > 0 && opts.quality <= 100 ? opts.quality : this.quality;
        this.logs = this.logs || false;
        return this;
    }
    return SuperPdfToImg;
}());
exports.SuperPdfToImg = SuperPdfToImg;
//# sourceMappingURL=pdf2img.js.map