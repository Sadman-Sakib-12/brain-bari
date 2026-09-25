import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserService } from './user.service';
import { Role } from '@prisma/client';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await UserService.getUserById(id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User details retrieved successfully.',
    data: user,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { role } = req.body;
  if (!role || (role !== 'CLIENT' && role !== 'ADMIN')) {
    res.status(400).json({ success: false, message: 'Invalid role provided. Must be CLIENT or ADMIN.' });
    return;
  }
  const updatedUser = await UserService.updateUserRole(id, role as Role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User role updated to ${role} successfully.`,
    data: updatedUser,
  });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  // Ensure user is updating their own profile or is an admin
  if (req.user?.role !== 'ADMIN' && req.user?.id !== id) {
    res.status(403).json({ success: false, message: 'Forbidden. You can only update your own profile.' });
    return;
  }

  const updatedUser = await UserService.updateUserProfile(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully.',
    data: updatedUser,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await UserService.deleteUser(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully.',
    data: null,
  });
});

export const UserController = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserProfile,
  deleteUser,
};
