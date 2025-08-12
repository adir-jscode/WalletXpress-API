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
exports.AuthServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userTokens_1 = require("../../utils/userTokens");
const env_1 = require("../../config/env");
const sendEmail_1 = require("../../utils/sendEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const credentialsLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, password } = payload;
    const isUserExist = yield user_model_1.User.findOne({ phone });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid phone number");
    }
    else if (isUserExist.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
    }
    else if (isUserExist.isActive !== user_interface_1.IsActive.ACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `The account is ${isUserExist.isActive}`);
    }
    else if (!isUserExist.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
    }
    else if (isUserExist.approvalStatus !== user_interface_1.ApprovalStatus.APPROVED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not approved by admin");
    }
    const passwordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
    if (!passwordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Incorrect Password");
    }
    const userToken = (0, userTokens_1.createUserTokens)(isUserExist);
    const _a = isUserExist.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest,
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userTokens_1.createAccessTokenWithRefreshToken)(refreshToken);
    return newAccessToken;
});
const changePassword = (decodedToken, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.id);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    const passwordMatched = yield bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!passwordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Old password is incorrect");
    }
    const hashNewPassword = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.password = hashNewPassword;
    user.save();
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    else if (isUserExist.isActive !== user_interface_1.IsActive.ACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `The account is ${isUserExist.isActive}`);
    }
    else if (isUserExist.isDeleted === true ||
        isUserExist.isVerified === false) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "account is deleted or not verified");
    }
    else if (isUserExist.approvalStatus !== user_interface_1.ApprovalStatus.APPROVED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "The Account is not approved");
    }
    const jwtPayload = {
        id: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
        walletId: isUserExist.wallet,
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m",
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Forget Password Request",
        templateName: "forgotPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink,
        },
    });
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id !== decodedToken.id) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You can not reset your password");
    }
    const isUserExist = yield user_model_1.User.findById(decodedToken.id);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user not found");
    }
    const hashNewPassword = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    isUserExist.password = hashNewPassword;
    yield isUserExist.save();
});
exports.AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
