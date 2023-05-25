"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SuperVCS = void 0;
var underscore_1 = __importDefault(require("underscore"));
var moment_1 = __importDefault(require("moment"));
var tracer_1 = require("tracer");
var logger = (0, tracer_1.colorConsole)();
var leftPad = function (number, targetLength) {
    // fonction pour formater un nombre avec de 0 devant
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
};
var compileInvoiceNumber = function (formatter, inputs) {
    // inputs = {
    // 	date : DD/MM/YYYY,
    // 	currentnumber : number, 
    // }
    // formatter = {date|YYYY/MM/DD}{-}{0000}
    // {date|DD/MM/YYYY}
    // Permet d'incrémenter la date de facturation (ex:25/01/2019)
    // DD > jours (01 à 31), MM > mois (01 à 12), YYYY > année, hh > heure (00 à 12), HH > heure (00 à 23), mm > minutes (00 à 59), A > Post or ante meridiem (AM, PM)
    // {0000}
    // Permet d'incrémenter le numéro de la facture, de 0 jusqu'au nombre maximum constuctible avec le nombre de zéros indiqués (ici : 9999)
    // {000} > 3 chiffres, {0000} > 4 chiffres, {00000} > 5 chiffres, etc...
    // {003} permet de commencer la numérotation à 3, le numéro maximum étant 999
    // {01065} permet de commencer la numérotation à 1065, le numéro maximum étant 9999
    // {$var} Permet de générer du texte dans le numéro de facture
    // "$var" correspond à n'importe quel caractère (dont les caractères spéciaux, exceptés "{" et "}")
    // Exemples
    // {Facture-}{date|YYYYMMDD}{-}{00289} va générer un numéro type : Facture-20180205-02365
    // {FAC/}{date|YYYY/MM-DD}{...}{100} va générer un numéro type : FAC/2018/02-05...101
    // {FAC/}{date|YYYY/MM-DD/hh:mm}{->}{000} va générer un numéro type : FAC/2018/02-05/22:56->999
    var increment = underscore_1["default"].isNumber(inputs.currentnumber) ? inputs.currentnumber : undefined;
    if (!increment)
        return false;
    var focusdate = underscore_1["default"].isString(inputs.date) ? inputs.date : (0, moment_1["default"])().format("DD/MM/YYYY");
    var regex = /{(.*?)}/ig;
    var search = formatter.match(regex);
    var txt = [];
    underscore_1["default"].each(search, function (str) {
        var substr = str.substring(1, str.length - 1);
        if (!substr.search(new RegExp(/^date/, "gi"))) {
            var splitme = substr.split("|");
            var format = underscore_1["default"].isObject(splitme) ? splitme[1] : "DD/MM/YYYY";
            var date = (0, moment_1["default"])(focusdate, "DD/MM/YYYY").format(format);
            txt.push(date);
        }
        else if (!substr.search(new RegExp(/^([0-9]+)$/, "gi"))) {
            var length = substr.length;
            var start = Number(substr);
            if (start > 0)
                increment += start;
            txt.push(leftPad(increment, length));
        }
        else {
            txt.push(substr);
        }
    });
    return txt.join('');
};
var getRandomArbitrary = function (min, max) {
    var value = Math.random() * (max - min) + min;
    value = Math.floor(value);
    return value;
};
var replace = function (string, options) {
    options = underscore_1["default"].isObject(options) ? options : {};
    var _moment = underscore_1["default"].isDate(options.date) ? (0, moment_1["default"])(options.date) : (0, moment_1["default"])();
    // const n = _.isString(options.n) ? options.n : null
    // const nn = _.isString(options.nn) ? options.nn : null
    // const nnn = _.isString(options.nnn) ? options.nnn : null
    // let newString = string 
    // if(N>=0 && n) newString.replace(`\{N\}`, n) 
    // if(NN>=0 && nn) newString.replace(`\{NN\}`, nn) 
    // if(NNN>=0 && nnn) newString.replace(`\{NNN\}`, nnn) 
    var txt = [];
    var regex = /{(.*?)}/ig;
    var search = string.match(regex);
    search.map(function (str) {
        var substr = str.substring(1, str.length - 1);
        // logger.log(substr)
        if (!substr.search(/^date/gi)) {
            var splitme = substr.split("|");
            var format = underscore_1["default"].isObject(splitme) ? splitme[1] : "";
            var date = format.length > 0 ? _moment.format(format) : "";
            txt.push(date);
        }
        else if (!substr.search(/^COD$/gi)) {
            var cod = underscore_1["default"].isNumber(+options.cod) ? +options.cod : null;
            txt.push(cod);
        }
        else if (!substr.search(/^(N+)$/gi)) {
            var length_1 = substr.length;
            var number = underscore_1["default"].isString(options.number) ? options.number : null;
            txt.push(leftPad(number, length_1));
        }
        else if (!substr.search(/^(Y+)$/gi)) {
            var length_2 = substr.length;
            var year = _moment.format("YYYY");
            var first = 4 - length_2;
            // logger.log(length, year, first, year.substr(first, length) )
            if (length_2 <= 4) {
                txt.push(year.substr(first, length_2));
            }
        }
        else if (!substr.search(/^(MM)$/gi)) {
            var length_3 = 2;
            var month = _moment.format("MM");
            // logger.log(length, year, first, year.substr(first, length) )
            txt.push(String(month));
        }
        else if (!substr.search(/^([0-9]+)$/gi)) {
            var increment = underscore_1["default"].isNumber(options.inc) ? options.inc : null;
            var length_4 = substr.length;
            // On force que l'incrément ne soit pas plus grand que le nombre de chiffre souhaité ... tant pis pour la fin !
            var _increment = String(increment).substring(0, length_4);
            var start = Number(substr);
            if (start > 0)
                increment += start;
            txt.push(leftPad(+_increment, length_4));
        }
        else {
            txt.push(substr);
        }
    });
    var _txt = txt.join('');
    logger.trace("VCS : After replace {var} by number : ".concat(_txt));
    return _txt;
};
var structuredCommunication = function (string) {
    // 5130322928
    // input : xxxxxxxxxx
    // input : 512xxxxxxx
    // input : xx2536xxxx
    // +++123/4567/999XX+++
    var error = "Un VCS (".concat(string, ") doit avoir strictement 12 caract\u00E8res +++XXX/XXXX/XXXXX+++, \n\t\tles deux derniers \u00E9tant r\u00E9serv\u00E9 pour le modulo. \n\t\tVeuillez revoir le format du VCS dans la configuration !");
    var num = "";
    var _string = String(string);
    // On remplace les x par un nombre random
    num = _string.replace("x", getRandomArbitrary(0, 9));
    // On met le modulo 
    logger.trace("VCS : Before compute modulo : ".concat(num));
    if (+num > 0 && String(num).length === 10) {
        var rest = +num % 97;
        rest = rest === 0 ? 97 : rest;
        var modulo = leftPad(rest, 2);
        var text = num + "" + modulo;
        logger.trace("VCS : After compute modulo : ".concat(text));
        if (text.length === 12) {
            var check = +text > 0;
            if (!check)
                throw new Error("VCS has to be only with numbers !");
            text = "+++" + text.substr(0, 3) + "/" + text.substr(3, 4) + "/" + text.substr(7, 5) + "+++";
            return text;
        }
        else {
            throw new Error("VCS impossible to be generated !");
        }
    }
    else {
        throw new Error(error);
    }
};
exports.SuperVCS = {
    replace: replace,
    leftPad: leftPad,
    getRandomArbitrary: getRandomArbitrary,
    structuredCommunication: structuredCommunication,
    compileInvoiceNumber: compileInvoiceNumber
};
//# sourceMappingURL=VCS.js.map