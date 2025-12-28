import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import {
  createAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { ApprovalStatus, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { phone, password } = payload;
  const isUserExist = await User.findOne({ phone });
  const passwordMatched = await bcryptjs.compare(
    password as string,
    isUserExist?.password as string
  );
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid phone number");
  } else if (!passwordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  } else if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  } else if (isUserExist.isActive !== IsActive.ACTIVE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The account is ${isUserExist.isActive}`
    );
  } else if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
  } else if (isUserExist.approvalStatus !== ApprovalStatus.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not approved by admin");
  }

  const userToken = createUserTokens(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken);
  return newAccessToken;
};

const changePassword = async (
  decodedToken: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }
  const passwordMatched = await bcryptjs.compare(
    oldPassword,
    user?.password as string
  );
  if (!passwordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect");
  }
  const hashNewPassword = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user.password = hashNewPassword;
  user.save();
};

const forgetPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  } else if (isUserExist.isActive !== IsActive.ACTIVE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The account is ${isUserExist.isActive}`
    );
  } else if (
    isUserExist.isDeleted === true ||
    isUserExist.isVerified === false
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "account is deleted or not verified"
    );
  } else if (isUserExist.approvalStatus !== ApprovalStatus.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, "The Account is not approved");
  }
  const jwtPayload = {
    id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
    walletId: isUserExist.wallet,
  };
  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: "Forget Password Request",
    templateName: "forgotPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};

const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id !== decodedToken.id) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You can not reset your password"
    );
  }
  const isUserExist = await User.findById(decodedToken.id);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "user not found");
  }
  const hashNewPassword = await bcryptjs.hash(
    payload.password,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  isUserExist.password = hashNewPassword;
  await isUserExist.save();
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
