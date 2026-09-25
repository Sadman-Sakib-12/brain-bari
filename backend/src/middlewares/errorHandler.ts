import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { config } from '../config';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string | undefined, stack = '') {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Something went wrong on the server!';
  let errorMessages: { path: string | number; message: string }[] = [];

  // 1. Zod Validation Error
  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorMessages = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
  }
  // 2. Prisma Known Request Error
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      statusCode = 409;
      message = 'Duplicate key error: Unique constraint failed.';
      const target = (error.meta?.target as string[]) || [];
      errorMessages = [
        {
          path: target.join(','),
          message: `${target.join(', ')} already exists!`,
        },
      ];
    } else if (error.code === 'P2025') {
      statusCode = 404;
      message = (error.meta?.cause as string) || 'Record not found in database!';
      errorMessages = [{ path: '', message }];
    } else {
      statusCode = 400;
      message = error.message;
      errorMessages = [{ path: '', message: error.message }];
    }
  }
  // 3. Custom ApiError
  else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = [{ path: '', message: error.message }];
  }
  // 4. Generic JavaScript Error
  else if (error instanceof Error) {
    message = error.message;
    errorMessages = [{ path: '', message: error.message }];
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorMessages,
    stack: config.env === 'development' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
