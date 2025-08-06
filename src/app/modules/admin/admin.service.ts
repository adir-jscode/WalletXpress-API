import AppError from "../../errorHelpers/AppError";
import { ApprovalStatus, IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { Wallet } from "../wallet/wallet.model";

const changeUserWalletStatus = async (userId: string) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      isActive: IsActive.ACTIVE,
      approvalStatus: ApprovalStatus.APPROVED,
    },
    { new: true }
  );
  if (!updatedUser) {
    throw new AppError(400, "User not found");
  }
  //update wallet
  const updatedWallet = await Wallet.findOneAndUpdate(
    { owner: userId },
    { status: WalletStatus.ACTIVE },
    { new: true }
  );
  if (!updatedWallet) {
    throw new AppError(400, "Wallet not found");
  }
  return { updatedUser, updatedWallet };
};

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
    { new: true }
  );
  return updateUserWallet;
};

export const AdminServices = { changeUserWalletStatus, blockUnlockUserWallets };
