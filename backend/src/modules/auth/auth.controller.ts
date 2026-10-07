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

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully. Welcome email sent.',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Login successful.',
    data: result,
  });
});

const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.googleOAuthLogin(req.body);

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Google authentication successful.',
    data: result,
  });
});

const sendRegisterOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.sendRegisterOtp(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: result,
  });
});

const verifyRegisterOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyRegisterOtp(req.body);

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'OTP verified! Admin account created successfully.',
    data: result,
  });
});

const sendForgotPasswordOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.sendForgotPasswordOtp(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: result,
  });
});

const resetPasswordWithOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.resetPasswordWithOtp(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: result,
  });
});

export const AuthController = {
  register,
  sendRegisterOtp,
  verifyRegisterOtp,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
  login,
  googleAuth,
  syncAndGetToken,
  logout,
  getProfile,
};
