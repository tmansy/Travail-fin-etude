

import path from "path";
import fs from "fs";
import debug from "debug";

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
export function convert(inputFileBuffer, customReportName, options, callback) {

  const helper = require("carbone/lib/helper");
  const params = require("carbone/lib/params");
  const converter = require("carbone/lib/converter");

  const _convertTo = options.convertTo;
  const _hasConversion = options.extension !== _convertTo.extension || options.hardRefresh === true;
  const _isReturningBuffer = options.renderPrefix === undefined || options.renderPrefix === null;

  // If there is no conversion, and there is no renderPrefix, we return the buffer directly
  if (_hasConversion === false && _isReturningBuffer === true) {
    return callback(null, inputFileBuffer);
  }

  // generate a unique random & safe filename
  const _renderPrefix = (options.renderPrefix || '').replace(/[^0-9a-z-]/gi, '');
  const _randomNamePart = helper.getRandomString();
  const _customReportName = customReportName !== undefined ? customReportName : 'report';
  const _renderFilename = _renderPrefix + _randomNamePart + helper.encodeSafeFilename(_customReportName) + '.' + _convertTo.extension;
  const _renderFile = path.join(params.renderPath, _renderFilename);

  // no conversion, but return a path
  if (_hasConversion === false) {
    return fs.writeFile(_renderFile, inputFileBuffer, function (err) {
      if (err) {
        debug('Cannot write rendered file on disk' + err);
        return callback('Cannot write rendered file on disk', null);
      }
      return callback(null, _renderFile);
    });
  }

  // A conversion is necessary, generate a intermediate file for the converter
  const _intermediateFilename = _renderPrefix + _randomNamePart + '_tmp.' + options.extension;
  const _intermediateFile = path.join(params.renderPath, _intermediateFilename);
  fs.writeFile(_intermediateFile, inputFileBuffer, function (err) {
    if (err) {
      debug('Cannot write rendered file on disk' + err);
      return callback('Cannot write rendered file on disk', null);
    }
    // call the converter and tell him to generate directly the wanted filename
    converter.convertFile(_intermediateFile, _convertTo.format, _convertTo.optionsStr, _renderFile, function (errConvert, outputFile) {
      fs.unlink(_intermediateFile, function (err) {
        if (err) {
          debug('Cannot remove intermediate file before conversion ' + err);
        }
      });
      if (errConvert) {
        return callback(errConvert, null);
      }
      if (_isReturningBuffer === false) {
        return callback(null, outputFile);
      }
      fs.readFile(outputFile, function (err, outputBuffer) {
        fs.unlink(outputFile, function (err) {
          if (err) {
            debug('Cannot remove rendered file ' + err);
          }
        });
        if (err) {
          debug('Cannot returned file buffer ' + err);
          return callback('Cannot returned file buffer', null);
        }
        callback(null, outputBuffer);
      });
    });
  });
}
