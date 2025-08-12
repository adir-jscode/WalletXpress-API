"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordZodSchema = exports.forgotPasswordZodSchema = exports.changePasswordZodSchema = exports.loginZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.loginZodSchema = zod_1.default.object({
    phone: zod_1.default.string({ message: "Phone number must be a string" }),
    password: zod_1.default.string({ message: "Password must be a string" }),
});
exports.changePasswordZodSchema = zod_1.default.object({
    oldPassword: zod_1.default.string({ message: "Old password must be a string" }),
    newPassword: zod_1.default.string({ message: "New password must be a string" }),
});
exports.forgotPasswordZodSchema = zod_1.default.object({
    email: zod_1.default.string({ message: "Email must be a string" }).email(),
});
exports.resetPasswordZodSchema = zod_1.default.object({
    newPassword: zod_1.default.string({ message: "new password is required" }),
});
