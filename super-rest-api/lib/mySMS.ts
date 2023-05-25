// import { colorConsole } from "tracer";
// import async from "async";
// import _ from "underscore";
// import request from "request";
// import convert from "xml-js";

// const logger = colorConsole()

// const login = process.env.MYSMS_LOGIN;
// const pwd = process.env.MYSMS_PWD;
// const url = process.env.MYSMS_API;

// module.exports = {
//   sendSMS: (phoneNumber, text) => {
//     phoneNumber = phoneNumber.replace("+", "&#043;");

//     return new Promise((resolve, reject) => {
//       async.waterfall(
//         [
//           //RequestTokenRequest to API
//           (cb) => {
//             if (!text || !_.isString(text) || text.length === 0) {
//               cb("Il manque un texte");
//             } else if (
//               !phoneNumber ||
//               !_.isString(phoneNumber) ||
//               phoneNumber.length === 0
//             ) {
//               cb("Il manque un numéro de téléphone");
//             } else {
//               cb(null);
//             }
//           },
//           (cb) => {
//             const xmlBody =
//               '<RequestTokenRequest xmlns="http://schemas.datacontract.org/2004/07/Inforius.eCommunication.Contract.Message" xmlns:i="http://www.w3.org/2001/XMLSchemainstance">' +
//               "<Password>" +
//               pwd +
//               "</Password>" +
//               "<UserName>" +
//               login +
//               "</UserName>" +
//               "</RequestTokenRequest>";

//             request(
//               {
//                 method: "post",
//                 uri: url + "RequestToken",
//                 headers: { "Content-Type": "text/xml" },
//                 body: xmlBody,
//               },
//               (error, response, body) => {
//                 if (error) {
//                   cb(error);
//                 } else {
//                   const json = JSON.parse(
//                     convert.xml2json(body, { compact: true, spaces: 4 })
//                   );
//                   const Response = json.RequestTokenResponse;
//                   const token = Response.Token._text;
//                   if (_.isString(token) && token.length > 0) {
//                     cb(null, token);
//                   }
//                 }
//               }
//             );
//           },
//           (token, cb) => {
//             const xmlBody =
//               '<script xmlns="http://schemas.datacontract.org/2004/07/Inforius.eCommunication.Contract.Message">' +
//               "<context>" +
//               "<user>" +
//               login +
//               "</user>" +
//               // +'<sender>{OA-senderID}</sender>'
//               "<token>" +
//               token +
//               "</token>" +
//               "</context>" +
//               "<recipients>" +
//               "<recipient>" +
//               "<type>S</type>" +
//               "<number>" +
//               phoneNumber +
//               "</number>" +
//               "<text>" +
//               text +
//               "</text>" +
//               "<language>FR</language>" +
//               "</recipient>" +
//               "</recipients>" +
//               "</script>";

//             request(
//               {
//                 method: "post",
//                 uri: url + "Send",
//                 headers: { "Content-Type": "text/xml" },
//                 body: xmlBody,
//               },
//               (error, response, body) => {
//                 if (error) {
//                   cb(error);
//                 } else {
//                   const json = JSON.parse(
//                     convert.xml2json(body, { compact: true, spaces: 4 })
//                   );
//                   const Response = json.SendMessageResponse;
//                   const Messages =
//                     Response.Messages && Response.Messages.MessageStatus;
//                   const phoneNumber = Messages.Number && Messages.Number._text;

//                   if (_.isString(phoneNumber) && phoneNumber.length > 0) {
//                     cb(null, phoneNumber);
//                   } else {
//                     cb("Le numéro de téléphone n'existe pas ...");
//                   }
//                 }
//               }
//             );
//           },
//         ],
//         (err, phoneNumber) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(`Message has been sent to ${phoneNumber}`);
//           }
//         }
//       );
//     });
//   },
// };
