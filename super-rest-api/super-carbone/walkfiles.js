"use strict";
exports.__esModule = true;
exports.walkFiles = void 0;
/**
 * Parse and compute XML for all files of the template
 * @param  {Object}   template     template file returned by file.js
 * @param  {Object}   data         data to insert
 * @param  {Object}   options      {'complement', 'constiables', ...}
 * @param  {Integer}  currentIndex currently visited files in the template
 * @param  {Function} callback(err, template)
 */
function walkFiles(template, data, options, currentIndex, callback) {
    var builder = require("carbone/lib/builder");
    if (currentIndex >= template.files.length) {
        // we have parsed all files, now parse the reportName
        if (template.reportName !== undefined) {
            builder.buildXML(template.reportName, data, options, function (err, reportNameResult) {
                template.reportName = reportNameResult;
                callback(null, template);
            });
        }
        else {
            callback(null, template);
        }
        return;
    }
    var _file = template.files[currentIndex];
    if (_file.isMarked === true) {
        builder.buildXML(_file.data, data, options, function (err, xmlResult) {
            if (err) {
                return callback(err, template);
            }
            _file.data = xmlResult;
            process.nextTick(function () {
                walkFiles(template, data, options, ++currentIndex, callback);
            });
        });
    }
    else {
        walkFiles(template, data, options, ++currentIndex, callback);
    }
}
exports.walkFiles = walkFiles;
//# sourceMappingURL=walkfiles.js.map