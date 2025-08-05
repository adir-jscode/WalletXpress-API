import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";

const creatUser = async (payload: Partial<IUser>) => {
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
  const users = await User.find().populate("wallet").select("-password"); // don't pass password as response
  return users;
};
export const UserServices = { creatUser, getUsers };
