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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpServices = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const redis_config_1 = require("../../config/redis.config");
const sendEmail_1 = require("../../utils/sendEmail");
const wallet_model_1 = require("../wallet/wallet.model");
const wallet_interface_1 = require("../wallet/wallet.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const OTP_EXPIRATION = 2 * 60; // 2minute
const generateOtp = (length = 6) => {
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};
const sendOtp = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user not found");
    }
    if (isUserExist.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "user already verified");
    }
    const otp = generateOtp();
    const redisKey = `otp:${email}`;
    yield redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION,
        },
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your OTP verification code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp,
        },
    });
});
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user not found");
        }
        if (user.isVerified) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user is already verified");
        }
        const redisKey = `otp:${email}`;
        const savedOtp = yield redis_config_1.redisClient.get(redisKey);
        if (!savedOtp) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "OTP is expired");
        }
        if (savedOtp !== otp) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid OTP");
        }
        const verifiedUser = yield user_model_1.User.findOneAndUpdate({ email }, { isVerified: true }, { runValidators: true, new: true });
        if (!verifiedUser) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user not found");
        }
        yield Promise.all([
            wallet_model_1.Wallet.updateOne({ owner: verifiedUser._id }, { status: wallet_interface_1.WalletStatus.ACTIVE }, { runValidators: true }),
            redis_config_1.redisClient.del(redisKey),
        ]);
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.OtpServices = { sendOtp, verifyOtp };
