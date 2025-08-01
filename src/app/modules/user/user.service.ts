import { Wallet } from "../wallet/wallet.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const creatUser = async (payload: Partial<IUser>) => {
  const user = await User.create(payload);
  const wallet = await Wallet.create({ owner: user._id });
  return { user, wallet };
};
export const UserServices = { creatUser };
