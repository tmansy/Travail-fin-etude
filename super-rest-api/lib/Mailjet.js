"use strict";
exports.__esModule = true;
var tracer_1 = require("tracer");
var logger = (0, tracer_1.colorConsole)();
var mailjet = require("node-mailjet").connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
module.exports = {
    getMessage: function (MessageID) {
        return new Promise(function (resolve, reject) {
            var request = mailjet.get("message").id(MessageID).request();
            request
                .then(function (result) {
                resolve(result.body);
            })["catch"](function (err) {
                reject(err);
            });
        });
    },
    sendEmail: function (email, subject, content, options) {
        if (options === void 0) { options = {}; }
        var options = options || {};
        return new Promise(function (resolve, reject) {
            var mailOptions = {
                from: "contact@wilway.eu",
                from_name: options.from_name || "WilWay SPRL",
                to: email || "contact@wilway.eu",
                subject: subject,
                text: content,
                html: options.htmlcontent || content,
                attachments: options.attachments,
                cc: options.cc || null
            };
            var request = mailjet.post("send", { version: "v3.1" }).request({
                Messages: [
                    {
                        From: {
                            Email: mailOptions.from,
                            Name: mailOptions.from_name
                        },
                        To: [
                            {
                                Email: mailOptions.to
                            },
                        ],
                        Cc: mailOptions.cc && [
                            {
                                Email: mailOptions.cc
                            },
                        ],
                        Subject: mailOptions.subject,
                        TextPart: mailOptions.text,
                        HTMLPart: mailOptions.html,
                        Attachments: mailOptions.attachments
                    },
                ]
            });
            request
                .then(function (result) {
                logger.log("email has been sent");
                resolve("Votre email a bien été envoyé");
            })["catch"](function (err) {
                logger.log(err);
                reject(err.ErrorMessage);
            });
        });
    }
};
//# sourceMappingURL=Mailjet.js.map