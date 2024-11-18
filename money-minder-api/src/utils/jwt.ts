import jwt from 'jsonwebtoken';
import { config } from '../config/config';

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as TokenPayload & { exp: number };
};