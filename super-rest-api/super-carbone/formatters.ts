

import { colorConsole } from "tracer";
import { html2xml } from './html2xml';
const logger = colorConsole()


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

    var _html2xml = new html2xml(html)
    const xml = _html2xml.getXML()
    return xml

  }
  else return html;
}

// this formatter is separately to inject code
convHtml.canInjectXML = true;

function sanitizeHTML(html) {
  return html.replace(/<[\s\S]*?>/gi, "");
}

export const CarboneFormatters = {
  convHtml: convHtml,
  sanitizeHTML: sanitizeHTML,
};


