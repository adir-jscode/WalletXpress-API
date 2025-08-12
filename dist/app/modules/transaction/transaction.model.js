"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const transactionSchema = new mongoose_1.Schema({
    fromWallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet", required: true },
    toWallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet", required: true },
    initiator: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionType),
        required: true,
    },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    comission: { type: Number, default: 0 },
    status: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionStatus),
        default: transaction_interface_1.TransactionStatus.PENDING,
    },
}, { timestamps: true, versionKey: false });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
