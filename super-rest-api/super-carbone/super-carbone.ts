
import carbone from "carbone";
import { colorConsole } from "tracer";
import { walkFiles } from "./walkfiles";
import { convert } from "./convert";
import xmljs  from 'xml-js';
import { CarboneFormatters } from "./formatters";

const logger = colorConsole()

function searchDrawing(element) {
    const temp = []
    addChildren(element, temp)
    return temp
        .filter(el => el.name === "w:drawing")
        .map(el => searchLink(el))

}

function addChildren(el, temp) {
    const elements = el.elements || []
    for (var i = 0; i < elements.length; i++) {
        const _element = elements[i]
        temp.push(_element)
        addChildren(_element, temp)
    }
}

function searchLink(element) {
    const temp = []
    addChildren(element, temp)
    const link = temp.find(el => el.name === "hlinkClick")
    const blip = temp.find(el => el.name === "a:blip")
    return {
        Id: link && link.attributes && link.attributes["r:id"],
        Embed: blip && blip.attributes && blip.attributes["r:embed"],
    }
}

function replacePictures(report, data) {

    const files = report.files || []

    // On va remplacer tous les hyperliens s'il y en a 
    // On cherche toutes les relations 
    const rels = files.find(x => x.name === "word/_rels/document.xml.rels")
    const _rels = xmljs.xml2js(rels.data)
    const element = _rels.elements[0]
    let hyperlinks = []
    let links = element.elements
    if (element && element.name === "Relationships") {
        hyperlinks = links
            .filter(x => x.attributes.TargetMode === "External")
            .map(x => x.attributes)
            .filter(x => data.hasOwnProperty(x.Target))
    }

    if (hyperlinks.length > 0) {
        // On regarde dans le document si on trouve bien les ID des hyperliens. Ceux ci devraient nous amener vers d'autres ID ... super hein le openXML ! 
        const document = files.find(x => x.name === "word/document.xml")
        const _document = xmljs.xml2js(document.data)
        const blips = searchDrawing(_document)

        hyperlinks.map(x => {

            const blip = blips.find(y => y.Id === x.Id)
            x.HyperLink = blip && blip.Embed
            const _link = links.find(link => link.attributes && link.attributes.Id === x.HyperLink)
            x.Link = _link && _link.attributes
            x.TargetLink = x.Link && x.Link.Target

            const file = files.find(_file => String(_file.name).search(x.TargetLink) > 0)
            // logger.log(file)
            const base64 = data[x.Target]
            if (base64 && base64.length > 0) {
                const base64Data = base64
                    .replace(/^data:image\/png;base64,/, "")
                    .replace(/^data:image\/jpeg;base64,/, "")
                    .replace(/^data:image\/jpg;base64,/, "")
                const buff = Buffer.from(base64Data, "base64")
                file.data = buff
            }
            // logger.log(file)

        })

        // logger.log(_document.elements[0])

    }
}

carbone.render = (templatePath, data, optionsRaw, callbackRaw) => {

    const input = require("carbone/lib/input");
    const file = require('carbone/lib/file');
    const preprocessor = require('carbone/lib/preprocessor');

    input.parseOptions(optionsRaw, callbackRaw, function (options, callback) {
        // open the template (unzip if necessary)
        file.openTemplate(templatePath, function (err, template) {
            if (err) {
                return callback(err, null);
            }
            // Determine the template extension.
            const _extension = file.detectType(template);
            // It takes the user defined one, or use the file type.
            options.extension = optionsRaw.extension || _extension;
            if (options.extension === null) {
                return callback('Unknown input file type. It should be a docx, xlsx, pptx, odt, ods, odp, xhtml, html or an xml file');
            }
            // check and clean convertTo object, options.convertTo contains a clean version of optionsRaw.convertTo
            const _error = input.parseConvertTo(options, optionsRaw.convertTo);
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
                walkFiles(template, data, options, 0, function (err, report) {

                    replacePictures(report, data)

                    if (err) {
                        return callback(err, null);
                    }

                    // assemble all files and zip if necessary
                    file.buildFile(report, function (err, result) {

                        if (err) {
                            return callback(err, null);
                        }
                        convert(result, report.reportName, options, function (err, bufferOrFile) {
                            callback(err, bufferOrFile, report.reportName);
                        });
                    });
                });
            });
        });
    });
}

carbone.addFormatters( CarboneFormatters );

export const SuperCarbone = carbone