"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SuperCarbone = void 0;
var carbone_1 = __importDefault(require("carbone"));
var tracer_1 = require("tracer");
var walkfiles_1 = require("./walkfiles");
var convert_1 = require("./convert");
var xml_js_1 = __importDefault(require("xml-js"));
var formatters_1 = require("./formatters");
var logger = (0, tracer_1.colorConsole)();
function searchDrawing(element) {
    var temp = [];
    addChildren(element, temp);
    return temp
        .filter(function (el) { return el.name === "w:drawing"; })
        .map(function (el) { return searchLink(el); });
}
function addChildren(el, temp) {
    var elements = el.elements || [];
    for (var i = 0; i < elements.length; i++) {
        var _element = elements[i];
        temp.push(_element);
        addChildren(_element, temp);
    }
}
function searchLink(element) {
    var temp = [];
    addChildren(element, temp);
    var link = temp.find(function (el) { return el.name === "hlinkClick"; });
    var blip = temp.find(function (el) { return el.name === "a:blip"; });
    return {
        Id: link && link.attributes && link.attributes["r:id"],
        Embed: blip && blip.attributes && blip.attributes["r:embed"]
    };
}
function replacePictures(report, data) {
    var files = report.files || [];
    // On va remplacer tous les hyperliens s'il y en a 
    // On cherche toutes les relations 
    var rels = files.find(function (x) { return x.name === "word/_rels/document.xml.rels"; });
    var _rels = xml_js_1["default"].xml2js(rels.data);
    var element = _rels.elements[0];
    var hyperlinks = [];
    var links = element.elements;
    if (element && element.name === "Relationships") {
        hyperlinks = links
            .filter(function (x) { return x.attributes.TargetMode === "External"; })
            .map(function (x) { return x.attributes; })
            .filter(function (x) { return data.hasOwnProperty(x.Target); });
    }
    if (hyperlinks.length > 0) {
        // On regarde dans le document si on trouve bien les ID des hyperliens. Ceux ci devraient nous amener vers d'autres ID ... super hein le openXML ! 
        var document_1 = files.find(function (x) { return x.name === "word/document.xml"; });
        var _document = xml_js_1["default"].xml2js(document_1.data);
        var blips_1 = searchDrawing(_document);
        hyperlinks.map(function (x) {
            var blip = blips_1.find(function (y) { return y.Id === x.Id; });
            x.HyperLink = blip && blip.Embed;
            var _link = links.find(function (link) { return link.attributes && link.attributes.Id === x.HyperLink; });
            x.Link = _link && _link.attributes;
            x.TargetLink = x.Link && x.Link.Target;
            var file = files.find(function (_file) { return String(_file.name).search(x.TargetLink) > 0; });
            // logger.log(file)
            var base64 = data[x.Target];
            if (base64 && base64.length > 0) {
                var base64Data = base64
                    .replace(/^data:image\/png;base64,/, "")
                    .replace(/^data:image\/jpeg;base64,/, "")
                    .replace(/^data:image\/jpg;base64,/, "");
                var buff = Buffer.from(base64Data, "base64");
                file.data = buff;
            }
            // logger.log(file)
        });
        // logger.log(_document.elements[0])
    }
}
carbone_1["default"].render = function (templatePath, data, optionsRaw, callbackRaw) {
    var input = require("carbone/lib/input");
    var file = require('carbone/lib/file');
    var preprocessor = require('carbone/lib/preprocessor');
    input.parseOptions(optionsRaw, callbackRaw, function (options, callback) {
        // open the template (unzip if necessary)
        file.openTemplate(templatePath, function (err, template) {
            if (err) {
                return callback(err, null);
            }
            // Determine the template extension.
            var _extension = file.detectType(template);
            // It takes the user defined one, or use the file type.
            options.extension = optionsRaw.extension || _extension;
            if (options.extension === null) {
                return callback('Unknown input file type. It should be a docx, xlsx, pptx, odt, ods, odp, xhtml, html or an xml file');
            }
            // check and clean convertTo object, options.convertTo contains a clean version of optionsRaw.convertTo
            var _error = input.parseConvertTo(options, optionsRaw.convertTo);
            if (_error) {
                return callback(_error);
            }
            template.reportName = options.reportName;
            template.extension = options.extension;
            preprocessor.execute(template, options, function (err, template) {
                if (err) {
                    return callback(err, null);
                }
                // parse all files of the template
                (0, walkfiles_1.walkFiles)(template, data, options, 0, function (err, report) {
                    replacePictures(report, data);
                    if (err) {
                        return callback(err, null);
                    }
                    // assemble all files and zip if necessary
                    file.buildFile(report, function (err, result) {
                        if (err) {
                            return callback(err, null);
                        }
                        (0, convert_1.convert)(result, report.reportName, options, function (err, bufferOrFile) {
                            callback(err, bufferOrFile, report.reportName);
                        });
                    });
                });
            });
        });
    });
};
carbone_1["default"].addFormatters(formatters_1.CarboneFormatters);
exports.SuperCarbone = carbone_1["default"];
//# sourceMappingURL=super-carbone.js.map