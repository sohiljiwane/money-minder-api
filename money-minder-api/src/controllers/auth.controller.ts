import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens } from '../utils/jwt';
import { AppError } from '../middleware/error';
import { z } from 'zod';

// ... Previous register function ...

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = generateTokens({ userId: user.id, email: user.email });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    res.json({
      message: 'Login successful',
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    next(error);
  }
};