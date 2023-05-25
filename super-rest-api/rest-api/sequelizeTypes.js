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
exports.SuperTypes = void 0;
var CryptoJS = __importStar(require("crypto-js"));
var sequelize_1 = require("sequelize");
var secretKey = process.env.ENCRYPT_SECRET || "fdpouifh48786fsd45f68s7d_f6sd87fsd86fsdf898_sd47fsdf9fg8sdf4g6df";
var encryptor = require("simple-encryptor")(secretKey);
if (!(secretKey && secretKey.length > 0))
    throw new Error("You have to set ENCRYPT_SECRET(SRTING) as environment variable");
function encrypt(value) {
    var enc = encryptor.encrypt(value);
    return enc;
}
function decrypt(value) {
    var val;
    try {
        val = encryptor.decrypt(value);
    }
    catch (e) {
        val = null;
    }
    return val;
}
exports.SuperTypes = {
    PASSWORD: function (name) {
        return {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            set: function (value) {
                var hash = CryptoJS.HmacSHA256(value, secretKey).toString(CryptoJS.enc.Hex);
                this.setDataValue(name, hash);
            }
        };
    },
    ENCRYPTEDJSON: function (name, options) {
        if (options === void 0) { options = {}; }
        return {
            type: sequelize_1.DataTypes.TEXT(),
            set: function (value) {
                var val = JSON.stringify(value);
                this.setDataValue(name, encrypt(String(val)));
            },
            get: function () {
                var val = decrypt(this.getDataValue(name));
                try {
                    val = JSON.parse(val);
                }
                catch (err) { }
                return val;
            },
            options: options
        };
    },
    ENCRYPTEDTEXT: function (name, options) {
        if (options === void 0) { options = {}; }
        return {
            type: sequelize_1.DataTypes.TEXT(),
            set: function (value) {
                this.setDataValue(name, encrypt(String(value)));
            },
            get: function () {
                var val = String(decrypt(this.getDataValue(name)));
                return val !== "null" && val.length > 0 ? val : "";
            },
            options: options
        };
    },
    ENCRYPTEDSTRING: function (name, options) {
        if (options === void 0) { options = {}; }
        return Object.assign({
            type: sequelize_1.DataTypes.STRING(),
            set: function (value) {
                this.setDataValue(name, encrypt(String(value)));
            },
            get: function () {
                var val = String(decrypt(this.getDataValue(name)));
                return val !== "null" && val.length > 0 ? val : "";
            }
        }, options);
    },
    ENCRYPTEDINTEGER: function (name, options) {
        if (options === void 0) { options = {}; }
        return {
            type: sequelize_1.DataTypes.STRING(),
            set: function (value) {
                this.setDataValue(name, encrypt(parseInt(value)));
            },
            get: function () {
                return parseInt(decrypt(this.getDataValue(name)));
            },
            options: options
        };
    },
    ENCRYPTEDFLOAT: function (name, options) {
        if (options === void 0) { options = {}; }
        return {
            type: sequelize_1.DataTypes.STRING(),
            set: function (value) {
                // console.log(value, parseFloat(value))
                this.setDataValue(name, encrypt(parseFloat(value)));
            },
            get: function () {
                var val = decrypt(this.getDataValue(name));
                // console.log(val, parseFloat(val))
                return parseFloat(val);
            },
            options: options
        };
    },
    encrypt: encrypt,
    decrypt: decrypt
};
//# sourceMappingURL=sequelizeTypes.js.map