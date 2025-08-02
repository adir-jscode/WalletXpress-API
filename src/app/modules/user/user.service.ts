import { Wallet } from "../wallet/wallet.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const creatUser = async (payload: Partial<IUser>) => {
  const user = await User.create(payload);
  const wallet = await Wallet.create({ owner: user._id });
  return { user, wallet };
};

const getUsers = async () => {
  const users = await User.find({});
  //password response e pass hobe na!!
  return users;
};
export const UserServices = { creatUser, getUsers };
