import prisma from '../../config/prisma';
import { generateToken } from '../../utils/jwt';

interface IAuthPayload {
  email: string;
  name: string;
  avatar?: string | null;
  role?: 'CLIENT' | 'ADMIN';
}

const syncUserAndIssueToken = async (payload: IAuthPayload) => {
  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    // If first user or specified as admin, create with role, otherwise default CLIENT
    user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        avatar: payload.avatar || null,
        role: payload.role || 'CLIENT',
      },
    });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

const getCurrentUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      bookings: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  return user;
};

export const AuthService = {
  syncUserAndIssueToken,
  getCurrentUser,
};
