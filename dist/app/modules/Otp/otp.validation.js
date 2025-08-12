"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpZodSchema = exports.sendOtpZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sendOtpZodSchema = zod_1.default.object({
    email: zod_1.default.string({ message: "Email is required" }).email(),
    name: zod_1.default.string({ message: "Name is required" }).min(2).max(100),
});
exports.verifyOtpZodSchema = zod_1.default.object({
    email: zod_1.default.string({ message: "Email is required" }).email(),
    otp: zod_1.default.string({ message: "OTP is required" }).min(6),
});
