import crypto from "crypto";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import { Wallet } from "../wallet/wallet.model";
import { WalletStatus } from "../wallet/wallet.interface";
import mongoose from "mongoose";

const OTP_EXPIRATION = 2 * 60; // 2minute

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOtp = async (email: string, name: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "user not found");
  }
  if (isUserExist.isVerified) {
    throw new AppError(httpStatus.UNAUTHORIZED, "user already verified");
  }
  const otp = generateOtp();
  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP verification code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
};

const verifyOtp = async (email: string, otp: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, "user not found");
    }
    if (user.isVerified) {
      throw new AppError(httpStatus.BAD_REQUEST, "user is already verified");
    }

    const redisKey = `otp:${email}`;
    const savedOtp = await redisClient.get(redisKey);
    if (!savedOtp) {
      throw new AppError(httpStatus.BAD_REQUEST, "OTP is expired");
    }
    if (savedOtp !== otp) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
    }

    const verifiedUser = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { runValidators: true, new: true }
    );
    if (!verifiedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "user not found");
    }

    await Promise.all([
      Wallet.updateOne(
        { owner: verifiedUser._id },
        { status: WalletStatus.ACTIVE },
        { runValidators: true }
      ),
      redisClient.del(redisKey),
    ]);
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const OtpServices = { sendOtp, verifyOtp };
