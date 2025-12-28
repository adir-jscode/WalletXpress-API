"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const wallet_model_1 = require("../wallet/wallet.model");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //transaction rollback
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const { password } = payload, rest = __rest(payload, ["password"]);
        const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const user = yield user_model_1.User.create([Object.assign(Object.assign({}, rest), { password: hashedPassword })], {
            session,
        });
        const wallet = yield wallet_model_1.Wallet.create([{ owner: user[0]._id }], { session });
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(user[0]._id, {
            wallet: wallet[0]._id,
        }, { new: true, runValidators: true, session }).select("-password");
        // await OtpServices.sendOtp(payload?.email as string, payload.name as string);
        yield session.commitTransaction();
        session.endSession();
        return { updatedUser, wallet };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({ role: user_interface_1.Role.USER })
        .populate("wallet")
        .select("-password");
    return users;
});
const getAgents = () => __awaiter(void 0, void 0, void 0, function* () {
    const agents = yield user_model_1.User.find({ role: user_interface_1.Role.AGENT })
        .populate("wallet")
        .select("-password");
    return agents;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user,
    };
});
exports.UserServices = { createUser, getUsers, getAgents, getMe };
