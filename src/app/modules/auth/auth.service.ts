import AppError from "../../errorHelpers/AppError";
import { ApprovalStatus, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import {
  createAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { phone, password } = payload;
  const isUserExist = await User.findOne({ phone });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid phone number");
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

  const passwordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password
  );
  if (!passwordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
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
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The Account is not approved yet"
    );
  }

  const resetUILink = ``;
  await sendEmail({
    to: email,
    subject: "Password reset",
    templateName: "forgotPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  changePassword,
  forgetPassword,
};
