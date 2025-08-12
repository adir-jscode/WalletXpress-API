"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnvVariables = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRES",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",
        "ADMIN_NAME",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "ADMIN_PHONE",
        "ADMIN_ADDRESS",
        "ADMIN_NID",
        "SMTP_USER",
        "SMTP_PASS",
        "SMTP_PORT",
        "SMTP_HOST",
        "SMTP_FROM",
        "FRONTEND_URL",
        "REDIS_USERNAME",
        "REDIS_PASSWORD",
        "REDIS_HOST",
        "REDIS_PORT",
    ];
    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required enviroment varable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        ADMIN_NAME: process.env.ADMIN_NAME,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        ADMIN_PHONE: process.env.ADMIN_PHONE,
        ADMIN_ADDRESS: process.env.ADMIN_ADDRESS,
        ADMIN_NID: process.env.ADMIN_NID,
        FRONTEND_URL: process.env.FRONTEND_URL,
        EMAIL_SENDER: {
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASS: process.env.SMTP_PASS,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_FROM: process.env.SMTP_FROM,
        },
        REDIS: {
            REDIS_USERNAME: process.env.REDIS_USERNAME,
            REDIS_PASSWORD: process.env.REDIS_PASSWORD,
            REDIS_HOST: process.env.REDIS_HOST,
            REDIS_PORT: process.env.REDIS_PORT,
        },
    };
};
exports.envVars = loadEnvVariables();
