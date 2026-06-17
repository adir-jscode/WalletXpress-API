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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
const user_model_1 = require("../user/user.model");
const transaction_model_1 = require("./transaction.model");
const createTransaction = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.create(payload);
    return transaction;
});
//View transaction history -> logged in user id
const getTransactionHistory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = payload.id;
    //find walletId from user
    const walletId = yield user_model_1.User.findById(userId).select("wallet");
    if (!walletId) {
        throw new Error("Wallet not found for the user");
    }
    const transactionHistory = yield transaction_model_1.Transaction.find({
        $or: [{ initiator: userId }, { type: "CASH_IN" }],
    }).populate("initiator");
    //sort by createdAt descending
    transactionHistory.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return transactionHistory;
});
const getAllTransaction = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find({}).populate("initiator");
    return transactions;
});
const getUserTransaction = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find({
        $or: [{ initiator: userId }],
    }).populate("initiator");
    return transactions;
});
exports.TransactionServices = {
    createTransaction,
    getTransactionHistory,
    getAllTransaction,
    getUserTransaction,
};
