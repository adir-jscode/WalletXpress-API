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
exports.AdminServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
// const changeUserWalletStatus = async (userId: string) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     userId,
//     {
//       isActive: IsActive.ACTIVE,
//       approvalStatus: ApprovalStatus.APPROVED,
//     },
//     { new: true }
//   );
//   if (!updatedUser) {
//     throw new AppError(400, "User not found");
//   }
//   //update wallet
//   const updatedWallet = await Wallet.findOneAndUpdate(
//     { owner: userId },
//     { status: WalletStatus.ACTIVE },
//     { new: true }
//   );
//   if (!updatedWallet) {
//     throw new AppError(400, "Wallet not found");
//   }
//   return { updatedUser, updatedWallet };
// };
const blockUnlockUserWallets = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const userWallet = yield wallet_model_1.Wallet.findOne({ owner: userId });
    if (!userWallet) {
        throw new AppError_1.default(400, "Wallet not found");
    }
    const updateUserWallet = yield wallet_model_1.Wallet.findByIdAndUpdate(userWallet.id, {
        status: status,
    }, { new: true });
    return updateUserWallet;
});
const approveSuspendAgent = (userId, approvalStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const isAgentExist = yield user_model_1.User.findOne({ _id: userId, role: user_interface_1.Role.AGENT });
    if (!isAgentExist) {
        throw new AppError_1.default(400, "Agent not found");
    }
    const updateAgent = yield user_model_1.User.findByIdAndUpdate(userId, { approvalStatus: approvalStatus }, { new: true });
    return updateAgent;
});
exports.AdminServices = {
    blockUnlockUserWallets,
    approveSuspendAgent,
};
