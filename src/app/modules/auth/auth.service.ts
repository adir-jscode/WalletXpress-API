import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { generateAccessToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import {
  createAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { phone, password } = payload;
  const isUserExist = await User.findOne({ phone });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid phone number");
  }
  const passwordMatched = bcryptjs.compare(
    isUserExist.password,
    password as string
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

export const AuthServices = { credentialsLogin, getNewAccessToken };
