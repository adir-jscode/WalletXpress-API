import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateAccessToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const accessToken = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  } as SignOptions);

  return accessToken;
};

export const verifyToken = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
};
