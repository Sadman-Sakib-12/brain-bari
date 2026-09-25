import { NextFunction, Request, Response } from 'express';
import { verifyTokenHelper } from '../utils/jwt';
import prisma from '../config/prisma';

export interface IAuthUser {
  id: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Unauthorized access. No authentication token provided.',
      });
      return;
    }

    const decoded = verifyTokenHelper(token) as unknown as IAuthUser;

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Unauthorized access. User not found.',
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Unauthorized access. Invalid or expired token.',
    });
  }
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      statusCode: 403,
      message: 'Forbidden. Admin privileges required to access this resource.',
    });
    return;
  }
  next();
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = verifyTokenHelper(token) as unknown as IAuthUser;
      const user = await prisma.user.findUnique({
        where: { email: decoded.email },
        select: { id: true, email: true, role: true },
      });
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    }
    next();
  } catch {
    next();
  }
};
