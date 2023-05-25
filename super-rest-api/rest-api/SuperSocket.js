"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.SuperSocket = void 0;
var _ = __importStar(require("underscore"));
var tracer_1 = require("tracer");
var logger = (0, tracer_1.colorConsole)();
function SuperSocket(req, res, next) {
    var _a;
    var params = req.query;
    if (((_a = res.locals) === null || _a === void 0 ? void 0 : _a.io) && _.has(params, "socket") && params.socket.length > 0 && params.socket !== "true") {
        res.locals.io.emit(params.socket, res.locals.response);
    }
    next();
}
exports.SuperSocket = SuperSocket;
//# sourceMappingURL=SuperSocket.js.map