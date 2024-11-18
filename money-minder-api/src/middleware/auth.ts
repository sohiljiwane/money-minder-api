import { Request, Response, NextFunction } from 'express';
import { AppError } from './error';
import { verifyToken } from '../utils/jwt';
import prisma from '../config/database';
import { config } from '../config/config';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, config.jwt.accessSecret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};