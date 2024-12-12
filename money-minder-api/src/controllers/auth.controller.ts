import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens } from '../utils/jwt';
import { AppError } from '../middleware/error';

// ... Previous register function ...

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    console.log("Email: " + email);

    const user = await prisma.user.findFirst({ 
        where: { 
          email: email 
        } 
      });
      console.log(user);
    if (user == null) {
      throw new AppError('Invalid credentials', 401);
    }

    //const isValidPassword = await comparePassword(password, user.password);
    const isValidPassword = password === user.password;
    console.log(isValidPassword);
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

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Extract user ID from the authenticated request
      const userId = req.user?.id;
  
      console.log("API called and user id is " + userId);
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }
  
      // Delete the current session
      await prisma.session.deleteMany({
        where: {
          userId: userId,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
        },
      });
  
      // Update the user to remove the refresh token
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
  
      res.json({
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  };