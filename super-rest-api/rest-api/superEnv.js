"use strict";
exports.__esModule = true;
exports.SuperConfiguration = void 0;
var SuperConfig = /** @class */ (function () {
    function SuperConfig() {
        this.root = __dirname;
        this.log = false;
        this.createDatabase = true;
    }
    SuperConfig.prototype.set = function (key, value) {
        this[key] = value;
    };
    return SuperConfig;
}());
exports.SuperConfiguration = new SuperConfig();
//# sourceMappingURL=superEnv.js.map