import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const syncAndGetToken = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.syncUserAndIssueToken(req.body);

  // Set secure cookie for token
  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User authenticated and JWT token issued successfully.',
    data: result,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged out successfully.',
    data: null,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const email = req.user?.email;
  if (!email) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const user = await AuthService.getCurrentUser(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile retrieved successfully.',
    data: user,
  });
});

export const AuthController = {
  syncAndGetToken,
  logout,
  getProfile,
};
