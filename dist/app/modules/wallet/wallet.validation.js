"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletStatusZodSchema = exports.sendMoneyToUserSchema = exports.withdrawMoneySchema = exports.addMoneySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const wallet_interface_1 = require("./wallet.interface");
exports.addMoneySchema = zod_1.default.object({
    phone: zod_1.default.string(),
    balance: zod_1.default.number().positive(),
});
exports.withdrawMoneySchema = zod_1.default.object({
    phone: zod_1.default.string(),
    balance: zod_1.default.number().positive(),
});
exports.sendMoneyToUserSchema = zod_1.default.object({
    phone: zod_1.default.string(),
    balance: zod_1.default.number().positive(),
});
exports.updateWalletStatusZodSchema = zod_1.default.object({
    status: zod_1.default.enum(Object.values(wallet_interface_1.WalletStatus)),
});
