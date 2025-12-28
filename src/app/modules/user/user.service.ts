import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  //transaction rollback
  const session = await User.startSession();
  session.startTransaction();
  try {
    const { password, ...rest } = payload;
    const hashedPassword = await bcryptjs.hash(
      password as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
    const user = await User.create([{ ...rest, password: hashedPassword }], {
      session,
    });
    const wallet = await Wallet.create([{ owner: user[0]._id }], { session });
    const updatedUser = await User.findByIdAndUpdate(
      user[0]._id,
      {
        wallet: wallet[0]._id,
      },
      { new: true, runValidators: true, session }
    ).select("-password");

    // await OtpServices.sendOtp(payload?.email as string, payload.name as string);
    await session.commitTransaction();
    session.endSession();
    return { updatedUser, wallet };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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

const getMe = async (userId: string) => {
  const user = await User.findById(userId)
    .select("-password")
    .populate("wallet");
  return {
    data: user,
  };
};
export const UserServices = { createUser, getUsers, getAgents, getMe };
