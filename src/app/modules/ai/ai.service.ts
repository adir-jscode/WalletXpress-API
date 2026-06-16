import Groq from "groq-sdk";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// ── Step 1: RETRIEVE — fetch user's real financial data ──────────────────
const getUserFinancialContext = async (userId: string) => {
  const user = await User.findById(userId).lean();
  const wallet = await Wallet.findOne({ owner: userId }).lean();

  // Last 30 transactions involving this user's wallet
  const transactions = await Transaction.find({
    $or: [{ fromWallet: wallet?._id }, { toWallet: wallet?._id }],
  })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

  // Build a readable summary for the model
  const txSummary = transactions.map((t) => ({
    type: t.type,
    amount: t.amount,
    status: t.status,
    direction:
      t.toWallet?.toString() === wallet?._id?.toString() ? "IN" : "OUT",
  }));

  const totalIn = txSummary
    .filter((t) => t.direction === "IN")
    .reduce((s, t) => s + t.amount, 0);

  const totalOut = txSummary
    .filter((t) => t.direction === "OUT")
    .reduce((s, t) => s + t.amount, 0);

  return {
    userName: user?.name,
    currentBalance: wallet?.balance ?? 0,
    totalMoneyIn: totalIn,
    totalMoneyOut: totalOut,
    recentTransactions: txSummary,
  };
};

// ── Step 2: AUGMENT — build system prompt with retrieved context ─────────
const buildSystemPrompt = (
  context: Awaited<ReturnType<typeof getUserFinancialContext>>,
) => {
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

const chat = async (userId: string, message: string, history = []) => {
  const context = await getUserFinancialContext(userId);
  const systemPrompt = buildSystemPrompt(context);

  const response = await groq.chat.completions.create({
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
};
export const AIServices = { chat };
