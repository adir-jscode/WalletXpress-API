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
exports.AuthControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const setCookie_1 = require("../../utils/setCookie");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = yield auth_service_1.AuthServices.credentialsLogin(req.body);
    (0, setCookie_1.setAuthCookie)(res, loginInfo);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Logged in successfully",
        data: loginInfo,
    });
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No refresh token recieved from cookies");
    }
    const accessToken = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, accessToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "New Access token generated",
        data: accessToken,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged Out Successfully",
        data: null,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.AuthServices.changePassword(req.user, req.body.oldPassword, req.body.newPassword);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Changed Successfully",
        data: null,
    });
}));
const forgetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthServices.forgetPassword(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Reset password URL sent Successfully",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.id;
    const resetToken = req.query.token;
    const newPassword = req.body.newPassword;
    const payload = {
        id: userId,
        password: newPassword,
    };
    const decodedToken = yield (0, jwt_1.verifyToken)(resetToken, env_1.envVars.JWT_ACCESS_SECRET);
    yield auth_service_1.AuthServices.resetPassword(payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password reset Successfully",
        data: null,
    });
}));
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    forgetPassword,
    resetPassword,
};
