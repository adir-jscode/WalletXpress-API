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
exports.WalletServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_model_1 = require("./wallet.model");
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const wallet_interface_1 = require("./wallet.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const addMoney = (phone, balance, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const isUserExist = yield user_model_1.User.findOne({ phone: phone, role: user_interface_1.Role.USER });
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user not found");
        }
        const userWallet = yield wallet_model_1.Wallet.findOne({ owner: isUserExist._id });
        if (!userWallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user wallet not found");
        }
        if ((userWallet === null || userWallet === void 0 ? void 0 : userWallet.status) !== wallet_interface_1.WalletStatus.ACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `user wallet is ${userWallet === null || userWallet === void 0 ? void 0 : userWallet.status}`);
        }
        const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ owner: isUserExist._id }, { $inc: { balance: +balance } }, { new: true, session });
        const agentWallet = yield wallet_model_1.Wallet.findOne({ owner: decodedToken.id });
        if (!agentWallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "wallet not found");
        }
        if (!agentWallet || agentWallet.status !== wallet_interface_1.WalletStatus.ACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "agent wallet is not active");
        }
        if ((agentWallet === null || agentWallet === void 0 ? void 0 : agentWallet.balance) < balance) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "insufficient balance");
        }
        const updateAgentWallet = yield wallet_model_1.Wallet.findOneAndUpdate({ owner: decodedToken.id }, { $inc: { balance: -balance } }, { new: true, session });
        const transaction = yield transaction_model_1.Transaction.create([
            {
                fromWallet: agentWallet._id,
                toWallet: wallet === null || wallet === void 0 ? void 0 : wallet._id,
                initiator: decodedToken.id,
                type: transaction_interface_1.TransactionType.CASH_IN,
                amount: balance,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return { wallet, updateAgentWallet, transaction };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const withdrawMoney = (phone, balance, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    //transaction rollback
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userWallet = yield wallet_model_1.Wallet.findOne({ owner: decodedToken.id });
        if (!userWallet) {
            throw new AppError_1.default(400, "user wallet not found");
        }
        if (userWallet.status !== wallet_interface_1.WalletStatus.ACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `user wallet is ${userWallet.status}`);
        }
        if (userWallet.balance < balance) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient wallet balance");
        }
        const updateUserWallet = yield wallet_model_1.Wallet.findOneAndUpdate({ owner: decodedToken.id }, { $inc: { balance: -balance } }, { new: true, session });
        const agent = yield user_model_1.User.findOne({
            phone: phone,
            role: user_interface_1.Role.AGENT,
            isActive: user_interface_1.IsActive.ACTIVE,
            isVerified: true,
            isDeleted: false,
        });
        if (!agent) {
            throw new AppError_1.default(400, "Agent not found");
        }
        const updateAgent = yield wallet_model_1.Wallet.findOneAndUpdate({ owner: agent.id }, { $inc: { balance: +balance } }, { new: true, session });
        const transaction = yield transaction_model_1.Transaction.create([
            {
                fromWallet: userWallet._id,
                toWallet: agent.wallet,
                initiator: decodedToken.id,
                type: transaction_interface_1.TransactionType.CASH_OUT,
                amount: balance,
                status: transaction_interface_1.TransactionStatus.COMPLETED,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return { updateAgent, updateUserWallet, transaction };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const sendMoneyToUser = (phone, amount, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    //transaction rollback
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findOne({
            phone,
            role: user_interface_1.Role.USER,
            isDeleted: false,
            isVerified: true,
            isActive: user_interface_1.IsActive.ACTIVE,
            approvalStatus: user_interface_1.ApprovalStatus.APPROVED,
        });
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid phone number");
        }
        if (user._id.toString() === decodedToken.id) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not allowed to add money");
        }
        const decodedUserWallet = yield wallet_model_1.Wallet.findOneAndUpdate({
            owner: decodedToken.id,
            status: wallet_interface_1.WalletStatus.ACTIVE,
        }, { $inc: { balance: -amount } }, { new: true, session });
        if (!decodedUserWallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "your wallet not found or inactive");
        }
        const userWallet = yield wallet_model_1.Wallet.findOneAndUpdate({ _id: user.wallet, status: wallet_interface_1.WalletStatus.ACTIVE }, { $inc: { balance: +amount } }, { new: true, session });
        if (!userWallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User Wallet not found or inactive`);
        }
        const transaction = yield transaction_model_1.Transaction.create({
            fromWallet: decodedUserWallet === null || decodedUserWallet === void 0 ? void 0 : decodedUserWallet._id,
            toWallet: userWallet._id,
            initiator: decodedToken.id,
            type: transaction_interface_1.TransactionType.SEND,
            status: transaction_interface_1.TransactionStatus.COMPLETED,
            amount: amount,
        });
        yield session.commitTransaction();
        session.endSession();
        return { userWallet, transaction };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_model_1.Wallet.find({});
    return wallets;
});
exports.WalletServices = {
    addMoney,
    withdrawMoney,
    sendMoneyToUser,
    getWallets,
};
