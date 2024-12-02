import { Request, Response, NextFunction } from 'express';

// Custom error class for operational errors
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error status and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack: string | undefined = undefined;

  // If it's our custom AppError, use its properties
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Include stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    stack = err.stack;
  }

  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // Format the error response
  const errorResponse: any = {
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: {
        stack,
        ...err
      }
    })
  };

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      ...err
    });
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async handler wrapper to avoid try-catch blocks
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};