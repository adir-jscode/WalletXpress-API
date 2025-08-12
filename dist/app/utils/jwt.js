"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (payload, secret, expiresIn) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expiresIn,
    });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;
const verifyToken = (token, secret) => {
    const verifiedToken = jsonwebtoken_1.default.verify(token, secret);
    return verifiedToken;
};
exports.verifyToken = verifyToken;
