"use strict";
exports.__esModule = true;
exports.CarboneFormatters = void 0;
var tracer_1 = require("tracer");
var html2xml_1 = require("./html2xml");
var logger = (0, tracer_1.colorConsole)();
/**
 * Always return the same message if called (sort of "catch all" formatter)
 *
 * @version 0.13.0
 *
 * @example [ "My Car", "hello!" ]
 * @example [ "my car", "hello!" ]
 * @example [ null    , "hello!" ]
 * @example [ 1203    , "hello!" ]
 *
 * @param  {Mixed}   d           data
 * @param  {String}  message     text to print
 * @return {String} `message` is always printed
 */
function convHtml(html) {
    if (typeof html === 'string') {
        var _html2xml = new html2xml_1.html2xml(html);
        var xml = _html2xml.getXML();
        return xml;
    }
    else
        return html;
}
// this formatter is separately to inject code
convHtml.canInjectXML = true;
function sanitizeHTML(html) {
    return html.replace(/<[\s\S]*?>/gi, "");
}
exports.CarboneFormatters = {
    convHtml: convHtml,
    sanitizeHTML: sanitizeHTML
};
//# sourceMappingURL=formatters.js.map