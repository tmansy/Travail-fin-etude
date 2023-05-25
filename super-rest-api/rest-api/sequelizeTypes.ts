


import * as CryptoJS from "crypto-js"
import { DataTypes } from "sequelize";

const secretKey = process.env.ENCRYPT_SECRET || "fdpouifh48786fsd45f68s7d_f6sd87fsd86fsdf898_sd47fsdf9fg8sdf4g6df";
const encryptor = require("simple-encryptor")(secretKey)

if (!(secretKey && secretKey.length > 0))
    throw new Error(
        `You have to set ENCRYPT_SECRET(SRTING) as environment variable`
    );

function encrypt(value: string | number) {
    var enc = encryptor.encrypt(value);
    return enc;
}

function decrypt(value: any) {
    var val;
    try {
        val = encryptor.decrypt(value);
    } catch (e) {
        val = null;
    }
    return val;
}

export const SuperTypes = {

    PASSWORD: (name: any) => {
        return {
            type: DataTypes.STRING(255),
            allowNull: false,
            set(value: any) {
                var hash = CryptoJS.HmacSHA256(value, secretKey).toString(
                    CryptoJS.enc.Hex
                );
                this.setDataValue(name, hash);
            },
        };
    },

    ENCRYPTEDJSON: (name: any, options = {}) => {
        return {
            type: DataTypes.TEXT(),
            set(value: any) {
                const val = JSON.stringify(value);
                this.setDataValue(name, encrypt(String(val)));
            },
            get() {
                let val = decrypt(this.getDataValue(name));
                try {
                    val = JSON.parse(val);
                } catch (err) { }
                return val;
            },
            options
        };
    },

    ENCRYPTEDTEXT: (name: any, options = {}) => {
        return {
            type: DataTypes.TEXT(),
            set(value: any) {
                this.setDataValue(name, encrypt(String(value)));
            },
            get(): any {
                const val = String(decrypt(this.getDataValue(name)));
                return val !== "null" && val.length > 0 ? val : "";
            },
            options
        };
    },

    ENCRYPTEDSTRING: (name: any, options = {}) => {
        return Object.assign(
            {
                type: DataTypes.STRING(),
                set(value: any) {
                    this.setDataValue(name, encrypt(String(value)));
                },
                get(): any {
                    const val = String(decrypt(this.getDataValue(name)));
                    return val !== "null" && val.length > 0 ? val : "";
                },
            },
            options
        );
    },

    ENCRYPTEDINTEGER: (name: any, options = {}) => {
        return {
            type: DataTypes.STRING(),
            set(value: string) {
                this.setDataValue(name, encrypt(parseInt(value)));
            },
            get(): any {
                return parseInt(decrypt(this.getDataValue(name)));
            },
            options
        };
    },

    ENCRYPTEDFLOAT: (name: any, options = {}) => {
        return {
            type: DataTypes.STRING(), // Vu qu'on l'encrypt, ca deviendra une chaine de caractère
            set(value: string) {
                // console.log(value, parseFloat(value))
                this.setDataValue(name, encrypt(parseFloat(value)));
            },
            get() {
                const val = decrypt(this.getDataValue(name));
                // console.log(val, parseFloat(val))
                return parseFloat(val);
            },
            options
        };
    },

    encrypt: encrypt,
    decrypt: decrypt,
};
