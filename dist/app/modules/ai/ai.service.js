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
exports.AIServices = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const transaction_model_1 = require("../transaction/transaction.model");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
// ── Step 1: RETRIEVE — fetch user's real financial data ──────────────────
const getUserFinancialContext = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findById(userId).lean();
    const wallet = yield wallet_model_1.Wallet.findOne({ owner: userId }).lean();
    // Last 30 transactions involving this user's wallet
    const transactions = yield transaction_model_1.Transaction.find({
        $or: [{ fromWallet: wallet === null || wallet === void 0 ? void 0 : wallet._id }, { toWallet: wallet === null || wallet === void 0 ? void 0 : wallet._id }],
    })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();
    // Build a readable summary for the model
    const txSummary = transactions.map((t) => {
        var _a, _b;
        return ({
            type: t.type,
            amount: t.amount,
            status: t.status,
            direction: ((_a = t.toWallet) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = wallet === null || wallet === void 0 ? void 0 : wallet._id) === null || _b === void 0 ? void 0 : _b.toString()) ? "IN" : "OUT",
        });
    });
    const totalIn = txSummary
        .filter((t) => t.direction === "IN")
        .reduce((s, t) => s + t.amount, 0);
    const totalOut = txSummary
        .filter((t) => t.direction === "OUT")
        .reduce((s, t) => s + t.amount, 0);
    return {
        userName: user === null || user === void 0 ? void 0 : user.name,
        currentBalance: (_a = wallet === null || wallet === void 0 ? void 0 : wallet.balance) !== null && _a !== void 0 ? _a : 0,
        totalMoneyIn: totalIn,
        totalMoneyOut: totalOut,
        recentTransactions: txSummary,
    };
});
// ── Step 2: AUGMENT — build system prompt with retrieved context ─────────
const buildSystemPrompt = (context) => {
    return `You are a helpful financial assistant for WalletXpress, a digital wallet app.
You help users understand their wallet activity and answer finance-related questions.

=== USER FINANCIAL DATA ===
Name: ${context.userName}
Current Wallet Balance: ৳${context.currentBalance}
Total Money Received (last 30 tx): ৳${context.totalMoneyIn}
Total Money Spent (last 30 tx): ৳${context.totalMoneyOut}

Recent Transactions (latest first):
${JSON.stringify(context.recentTransactions, null, 2)}
===========================

Rules:
- Only answer based on the data above. Never make up transactions or balances.
- Be concise and friendly.
- Format amounts with ৳ symbol.
- If the user asks something unrelated to their wallet/finances, politely decline.`;
};
const chat = (userId_1, message_1, ...args_1) => __awaiter(void 0, [userId_1, message_1, ...args_1], void 0, function* (userId, message, history = []) {
    const context = yield getUserFinancialContext(userId);
    const systemPrompt = buildSystemPrompt(context);
    const response = yield groq.chat.completions.create({
        model: "llama-3.1-8b-instant", // free, fast, open-source model
        messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message },
        ],
        temperature: 0.3,
        max_tokens: 512,
    });
    return response.choices[0].message.content;
});
exports.AIServices = { chat };
