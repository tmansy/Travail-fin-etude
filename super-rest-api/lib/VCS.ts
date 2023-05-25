"use strict";

import _ from "underscore";
import moment from "moment";
import { colorConsole } from "tracer";
const logger = colorConsole()

const leftPad = (number, targetLength) => {
	// fonction pour formater un nombre avec de 0 devant
	var output = number + '';
	while (output.length < targetLength) {
		output = '0' + output;
	}
	return output;
}

const compileInvoiceNumber = (formatter, inputs) => {

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

	var increment = _.isNumber(inputs.currentnumber) ? inputs.currentnumber : undefined

	if (!increment) return false

	var focusdate = _.isString(inputs.date) ? inputs.date : moment().format("DD/MM/YYYY")
	var regex = /{(.*?)}/ig;
	var search = formatter.match(regex)
	var txt = []

	_.each(search, str => {
		var substr = str.substring(1, str.length - 1)
		if (!substr.search(new RegExp(/^date/, "gi"))) {
			var splitme = substr.split("|")
			var format = _.isObject(splitme) ? splitme[1] : "DD/MM/YYYY"
			var date = moment(focusdate, "DD/MM/YYYY").format(format)
			txt.push(date)
		}
		else if (!substr.search(new RegExp(/^([0-9]+)$/, "gi"))) {
			var length = substr.length
			var start = Number(substr)
			if (start > 0) increment += start
			txt.push(leftPad(increment, length))
		}
		else {
			txt.push(substr)
		}
	})

	return txt.join('')

}

const getRandomArbitrary = (min, max) => {
	var value = Math.random() * (max - min) + min
	value = Math.floor(value)
	return value
}

const replace = (string, options) => {

	options = _.isObject(options) ? options : {}
	const _moment = _.isDate(options.date) ? moment(options.date) : moment()
	// const n = _.isString(options.n) ? options.n : null
	// const nn = _.isString(options.nn) ? options.nn : null
	// const nnn = _.isString(options.nnn) ? options.nnn : null
	// let newString = string 
	// if(N>=0 && n) newString.replace(`\{N\}`, n) 
	// if(NN>=0 && nn) newString.replace(`\{NN\}`, nn) 
	// if(NNN>=0 && nnn) newString.replace(`\{NNN\}`, nnn) 

	const txt = []
	const regex = /{(.*?)}/ig;
	const search = string.match(regex);
	search.map(str => {
		const substr = str.substring(1, str.length - 1)
		// logger.log(substr)
		if (!substr.search(/^date/gi)) {
			const splitme = substr.split("|")
			const format = _.isObject(splitme) ? splitme[1] : ""
			const date = format.length > 0 ? _moment.format(format) : ""
			txt.push(date)
		}
		else if (!substr.search(/^COD$/gi)) {
			const cod = _.isNumber(+options.cod) ? +options.cod : null
			txt.push(cod)
		}
		else if (!substr.search(/^(N+)$/gi)) {
			const length = substr.length
			const number = _.isString(options.number) ? options.number : null
			txt.push(leftPad(number, length))
		}
		else if (!substr.search(/^(Y+)$/gi)) {
			const length = substr.length
			const year = _moment.format("YYYY")
			const first = 4 - length
			// logger.log(length, year, first, year.substr(first, length) )
			if (length <= 4) {
				txt.push(year.substr(first, length))
			}
		}
		else if (!substr.search(/^(MM)$/gi)) {
			const length = 2
			const month = _moment.format("MM")
			// logger.log(length, year, first, year.substr(first, length) )
			txt.push(String(month))
		}
		else if (!substr.search(/^([0-9]+)$/gi)) {
			let increment:number = _.isNumber(options.inc) ? options.inc : null
			const length = substr.length
			// On force que l'incrément ne soit pas plus grand que le nombre de chiffre souhaité ... tant pis pour la fin !
			const _increment = String(increment).substring(0, length)
			const start = Number(substr)
			if (start > 0) increment += start
			txt.push(leftPad(+_increment, length))
		}
		else {
			txt.push(substr)
		}
	})

	const _txt = txt.join('')
	
	logger.trace(`VCS : After replace {var} by number : ${_txt}`)

	return _txt
}

const structuredCommunication = (string) => {

	// 5130322928

	// input : xxxxxxxxxx
	// input : 512xxxxxxx
	// input : xx2536xxxx

	// +++123/4567/999XX+++

	const error = `Un VCS (${string}) doit avoir strictement 12 caractères +++XXX/XXXX/XXXXX+++, 
		les deux derniers étant réservé pour le modulo. 
		Veuillez revoir le format du VCS dans la configuration !`

	let num = ""
	const _string = String(string)
	// On remplace les x par un nombre random
	num = _string.replace("x", getRandomArbitrary(0, 9))
	// On met le modulo 

	logger.trace(`VCS : Before compute modulo : ${num}`)

	if (+num > 0 && String(num).length === 10) {
		let rest = +num % 97
		rest = rest===0 ? 97 : rest
		const modulo = leftPad(rest, 2)

		let text:string = num + "" + modulo

		logger.trace(`VCS : After compute modulo : ${text}`)

		if (text.length === 12) {
			const check = +text > 0
			if (!check) throw new Error("VCS has to be only with numbers !")
			text = "+++" + text.substr(0, 3) + "/" + text.substr(3, 4) + "/" + text.substr(7, 5) + "+++"
			return text
		} else {
			throw new Error("VCS impossible to be generated !")
		}


	} else {
		throw new Error(error)
	}

}

export const SuperVCS = {
	replace: replace,
	leftPad: leftPad,
	getRandomArbitrary: getRandomArbitrary,
	structuredCommunication: structuredCommunication,
	compileInvoiceNumber: compileInvoiceNumber,
}
