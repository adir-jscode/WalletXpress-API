import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {
  const { password, ...rest } = payload;
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const user = await User.create({ ...rest, password: hashedPassword });
  const wallet = await Wallet.create({ owner: user._id });
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      wallet: wallet._id,
    },
    { new: true, runValidators: true }
  );
  return { updatedUser, wallet };
};

const getUsers = async () => {
  const users = await User.find({ role: Role.USER })
    .populate("wallet")
    .select("-password");
  return users;
};
const getAgents = async () => {
  const agents = await User.find({ role: Role.AGENT })
    .populate("wallet")
    .select("-password");
  return agents;
};
export const UserServices = { createUser, getUsers, getAgents };
