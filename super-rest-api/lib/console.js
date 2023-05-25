"use strict";
exports.__esModule = true;
exports.SuperConsole = void 0;
var tracer_1 = require("tracer");
exports.SuperConsole = process.env.NODE_ENV === "development" ? (0, tracer_1.colorConsole)() : (0, tracer_1.console)();
//# sourceMappingURL=console.js.map