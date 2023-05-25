"use strict";

import { colorConsole } from "tracer";
const logger = colorConsole()
import * as _ from "underscore"
import * as async from "async"

const mailjet = require("node-mailjet").connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

module.exports = {
  getMessage: (MessageID:any) => {
    return new Promise((resolve, reject) => {
      const request = mailjet.get("message").id(MessageID).request();

      request
        .then((result:any) => {
          resolve(result.body);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
  },

  sendEmail: (email:string, subject:string, content:string, options:any = {}) => {
    var options = options || {};

    return new Promise((resolve, reject) => {
      var mailOptions = {
        from: "contact@wilway.eu",
        from_name: options.from_name || "WilWay SPRL",
        to: email || "contact@wilway.eu",
        subject: subject,
        text: content,
        html: options.htmlcontent || content,
        attachments: options.attachments,
        cc: options.cc || null, //"aubry.dinverno@inforius.be",
      };

      const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: mailOptions.from,
              Name: mailOptions.from_name,
            },
            To: [
              {
                Email: mailOptions.to,
              },
            ],
            Cc: mailOptions.cc && [
              {
                Email: mailOptions.cc,
              },
            ],
            Subject: mailOptions.subject,
            TextPart: mailOptions.text,
            HTMLPart: mailOptions.html,
            Attachments: mailOptions.attachments,
          },
        ],
      });

      request
        .then((result:any) => {
          logger.log("email has been sent");
          resolve("Votre email a bien été envoyé");
        })
        .catch((err:any) => {
          logger.log(err);
          reject(err.ErrorMessage);
        });
    });
  },
};
