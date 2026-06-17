import AppError from "../../errorHelpers/AppError";
import { ApprovalStatus, IsActive, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { Wallet } from "../wallet/wallet.model";

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

const blockUnlockUserWallets = async (userId: string, status: WalletStatus) => {
  const userWallet = await Wallet.findOne({ owner: userId });
  if (!userWallet) {
    throw new AppError(400, "Wallet not found");
  }
  const updateUserWallet = await Wallet.findByIdAndUpdate(
    userWallet.id,
    {
      status: status,
    },
    { new: true },
  );
  return updateUserWallet;
};

const approveSuspendAgent = async (userId: string) => {
  const isAgentExist = await User.findOne({ _id: userId, role: Role.AGENT });
  if (!isAgentExist) {
    throw new AppError(400, "Agent not found");
  }
  let approvalStatus: ApprovalStatus;
  if (isAgentExist.approvalStatus === ApprovalStatus.PENDING) {
    approvalStatus = ApprovalStatus.APPROVED;
  } else if (isAgentExist.approvalStatus === ApprovalStatus.APPROVED) {
    approvalStatus = ApprovalStatus.SUSPENDED;
  } else if (isAgentExist.approvalStatus === ApprovalStatus.SUSPENDED) {
    approvalStatus = ApprovalStatus.APPROVED;
  } else {
    throw new AppError(400, "Invalid approval status");
  }
  const updateAgent = await User.findByIdAndUpdate(
    userId,
    { approvalStatus: approvalStatus },
    { new: true },
  );
  return updateAgent;
};
const blockUser = async (userId: string) => {
  const userWallet = await User.findByIdAndUpdate(
    userId,
    { isActive: IsActive.BLOCKED },
    { new: true },
  );
  if (!userWallet) {
    throw new AppError(400, "User not found");
  }
  return userWallet;
};

export const AdminServices = {
  blockUnlockUserWallets,
  approveSuspendAgent,
  blockUser,
};
