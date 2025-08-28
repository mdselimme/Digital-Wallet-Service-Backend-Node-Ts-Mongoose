"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envData = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
;
const envVariable = () => {
    const requireVariable = ["MONGODB_CONFIG_URL", "NODE_DEV", "PORT", "BCRYPT_HASH_ROUND", "JWT_REFRESH_EXPIRED", "JWT_REFRESH_SECRET", "JWT_ACCESS_EXPIRED", "JWT_ACCESS_SECRET", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASS", "SUPER_ADMIN_PHONE", "SMTP_PASS",
        "SMTP_USER",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_FROM", "COOKIE_EXPIRES_REFRESH_TOKEN", "COOKIE_EXPIRES_ACCESS_TOKEN"];
    requireVariable.forEach((key) => {
        if (!process.env[key]) {
            // eslint-disable-next-line no-console
            console.log(`Env Variable ${key} Cannot Assign in .env file.`);
        }
    });
    return {
        PORT: process.env.PORT,
        MONGODB_CONFIG_URL: process.env.MONGODB_CONFIG_URL,
        BCRYPT_HASH_ROUND: process.env.BCRYPT_HASH_ROUND,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_ACCESS_EXPIRED: process.env.JWT_ACCESS_EXPIRED,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS,
        SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE,
        COOKIE_EXPIRES_ACCESS_TOKEN: process.env.COOKIE_EXPIRES_ACCESS_TOKEN,
        COOKIE_EXPIRES_REFRESH_TOKEN: process.env.COOKIE_EXPIRES_REFRESH_TOKEN,
        SMTP: {
            SMTP_PASS: process.env.SMTP_PASS,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_FROM: process.env.SMTP_FROM,
        },
        NODE_DEV: process.env.NODE_DEV,
    };
};
exports.envData = envVariable();
