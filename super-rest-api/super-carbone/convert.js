"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.convert = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var debug_1 = __importDefault(require("debug"));
/**
 * { function_description }
 *
 * @param {Buffer}    inputFileBuffer  The input file buffer
 * @param {String}    customReportName user-defined report name computed by Carbone
 * @param {Function}  options          options coming from input.parseOptions and input.parseConvertTo
 *                                     {
 *                                       convertTo : {
 *                                         extension  : 'pdf',
 *                                         format     : 'writer_pdf_Export' // coming from lib/format.js
 *                                         optionsStr : '44,34,76',         // only for CSV
 *                                         filters    : {                   // only for PDF, JPG, ...
 *                                           ReduceImageResolution : true
 *                                         }
 *                                       }
 *                                       extension    : 'odt' || Force input template extension
 *                                       hardRefresh  : (default: false) if true, LibreOffice is used to render and refresh the content of the report at the end of Carbone process
 *                                       renderPrefix : If defined, it add a prefix to the report name
 *                                     }
 * @param {Function}  callback(err, bufferOrPath) return a path if renderPrefix is defined, a buffer otherwise
 */
function convert(inputFileBuffer, customReportName, options, callback) {
    var helper = require("carbone/lib/helper");
    var params = require("carbone/lib/params");
    var converter = require("carbone/lib/converter");
    var _convertTo = options.convertTo;
    var _hasConversion = options.extension !== _convertTo.extension || options.hardRefresh === true;
    var _isReturningBuffer = options.renderPrefix === undefined || options.renderPrefix === null;
    // If there is no conversion, and there is no renderPrefix, we return the buffer directly
    if (_hasConversion === false && _isReturningBuffer === true) {
        return callback(null, inputFileBuffer);
    }
    // generate a unique random & safe filename
    var _renderPrefix = (options.renderPrefix || '').replace(/[^0-9a-z-]/gi, '');
    var _randomNamePart = helper.getRandomString();
    var _customReportName = customReportName !== undefined ? customReportName : 'report';
    var _renderFilename = _renderPrefix + _randomNamePart + helper.encodeSafeFilename(_customReportName) + '.' + _convertTo.extension;
    var _renderFile = path_1["default"].join(params.renderPath, _renderFilename);
    // no conversion, but return a path
    if (_hasConversion === false) {
        return fs_1["default"].writeFile(_renderFile, inputFileBuffer, function (err) {
            if (err) {
                (0, debug_1["default"])('Cannot write rendered file on disk' + err);
                return callback('Cannot write rendered file on disk', null);
            }
            return callback(null, _renderFile);
        });
    }
    // A conversion is necessary, generate a intermediate file for the converter
    var _intermediateFilename = _renderPrefix + _randomNamePart + '_tmp.' + options.extension;
    var _intermediateFile = path_1["default"].join(params.renderPath, _intermediateFilename);
    fs_1["default"].writeFile(_intermediateFile, inputFileBuffer, function (err) {
        if (err) {
            (0, debug_1["default"])('Cannot write rendered file on disk' + err);
            return callback('Cannot write rendered file on disk', null);
        }
        // call the converter and tell him to generate directly the wanted filename
        converter.convertFile(_intermediateFile, _convertTo.format, _convertTo.optionsStr, _renderFile, function (errConvert, outputFile) {
            fs_1["default"].unlink(_intermediateFile, function (err) {
                if (err) {
                    (0, debug_1["default"])('Cannot remove intermediate file before conversion ' + err);
                }
            });
            if (errConvert) {
                return callback(errConvert, null);
            }
            if (_isReturningBuffer === false) {
                return callback(null, outputFile);
            }
            fs_1["default"].readFile(outputFile, function (err, outputBuffer) {
                fs_1["default"].unlink(outputFile, function (err) {
                    if (err) {
                        (0, debug_1["default"])('Cannot remove rendered file ' + err);
                    }
                });
                if (err) {
                    (0, debug_1["default"])('Cannot returned file buffer ' + err);
                    return callback('Cannot returned file buffer', null);
                }
                callback(null, outputBuffer);
            });
        });
    });
}
exports.convert = convert;
//# sourceMappingURL=convert.js.map