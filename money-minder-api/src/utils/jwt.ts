import jwt from 'jsonwebtoken';
import { config } from '../config/config';

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateTokens = (payload: TokenPayload) => {
    // Ensure environment variables are set
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT secrets are not defined');
    }
  
    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      payload, 
      process.env.JWT_ACCESS_SECRET, 
      { 
        expiresIn: '15m' // 15 minutes
      }
    );
  
    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      payload, 
      process.env.JWT_REFRESH_SECRET, 
      { 
        expiresIn: '7d' // 7 days
      }
    );
  
    return { accessToken, refreshToken };
  };
  
  export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
      if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error('JWT access secret is not defined');
      }
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  };
  
  export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
      if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT refresh secret is not defined');
      }
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  };
  
  export const refreshAccessToken = (refreshToken: string) => {
    const payload = verifyRefreshToken(refreshToken);
    
    if (!payload) {
      throw new Error('Invalid refresh token');
    }
  
    // Generate new access token
    return jwt.sign(
      { userId: payload.userId, email: payload.email }, 
      process.env.JWT_ACCESS_SECRET!, 
      { 
        expiresIn: '15m' 
      }
    );
  };