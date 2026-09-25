import prisma from '../../config/prisma';
import { Role } from '@prisma/client';

const getAllUsers = async (query: { role?: string; search?: string; page?: string; limit?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (query.role && (query.role === 'CLIENT' || query.role === 'ADMIN')) {
    where.role = query.role as Role;
  }
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true, payments: true, bookings: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: users,
  };
};

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { createdAt: 'desc' } },
      payments: { orderBy: { createdAt: 'desc' } },
      bookings: { orderBy: { createdAt: 'desc' } },
    },
  });
};

const updateUserRole = async (id: string, role: Role) => {
  return await prisma.user.update({
    where: { id },
    data: { role },
  });
};

const updateUserProfile = async (
  id: string,
  data: { name?: string; phone?: string; company?: string; avatar?: string }
) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserProfile,
  deleteUser,
};
