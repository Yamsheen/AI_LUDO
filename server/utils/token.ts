import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: string;
};

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing in config.env");
  }
  return secret;
};

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, getSecret(), { expiresIn: "7d" });

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, getSecret()) as JwtPayload;
