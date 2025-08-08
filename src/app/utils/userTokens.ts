import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateAccessToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
    walletId: user.wallet,
  };

  const accessToken = generateAccessToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  const refreshToken = generateAccessToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;
  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(400, "User not found");
  }

  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(400, `User is ${isUserExist.isActive}`);
  }

  if (isUserExist.isDeleted) {
    throw new AppError(400, "User is deleted");
  }

  const jwtPayload = {
    id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
    walletId: isUserExist.wallet,
  };

  const newAccessToken = generateAccessToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return { accessToken: newAccessToken };
};
