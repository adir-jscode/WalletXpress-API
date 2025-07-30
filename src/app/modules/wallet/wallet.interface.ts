import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IWallet {
  owner: Types.ObjectId;
  balance: number;
  status: WalletStatus;
}
