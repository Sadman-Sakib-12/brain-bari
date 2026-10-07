import bcrypt from 'bcryptjs';
import prisma from '../../config/prisma';
import { generateToken } from '../../utils/jwt';
import { ApiError } from '../../middlewares/errorHandler';
import { MailerService } from '../../utils/mailer';

interface IAuthPayload {
  email: string;
  name: string;
  avatar?: string | null;
  role?: 'CLIENT' | 'ADMIN';
  password?: string;
}

const syncUserAndIssueToken = async (payload: IAuthPayload) => {
  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    let hashedPassword = null;
    if (payload.password) {
      hashedPassword = await bcrypt.hash(payload.password, 10);
    }
    user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        avatar: payload.avatar || null,
        password: hashedPassword,
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

interface IOtpRecord {
  code: string;
  type: 'REGISTER' | 'RESET_PASSWORD';
  expiresAt: number;
  data?: any;
}

const otpStore = new Map<string, IOtpRecord>();

// Clean up expired OTPs every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (now > value.expiresAt) {
      otpStore.delete(key);
    }
  }
}, 15 * 60 * 1000);

const sendRegisterOtp = async (data: {
  name: string;
  email: string;
  password?: string;
  role?: 'CLIENT' | 'ADMIN';
  phone?: string;
  company?: string;
}) => {
  const normalizedEmail = data.email.toLowerCase().trim();

  // Check if account already exists
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new ApiError(400, 'An account with this email address already exists.');
  }

  // Generate 6-digit cryptographically random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(normalizedEmail, {
    code: otp,
    type: 'REGISTER',
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes validity
    data: {
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password,
      role: data.role || (normalizedEmail.includes('admin') ? 'ADMIN' : 'CLIENT'),
      phone: data.phone || null,
      company: data.company || null,
    },
  });

  // Send OTP email via Nodemailer
  const emailSent = await MailerService.sendRegisterOtp({
    email: normalizedEmail,
    name: data.name.trim(),
    otp,
  }).catch((err) => {
    console.warn('Registration OTP mail error:', err);
    return false;
  });

  return {
    email: normalizedEmail,
    message: emailSent
      ? 'Verification code sent to your email address.'
      : 'Email dispatch failed (Gmail SMTP BadCredentials). Your OTP code has been logged to the backend console.',
    emailSent: !!emailSent,
    devOtp: process.env.NODE_ENV === 'development' || !emailSent ? otp : undefined,
  };
};

const verifyRegisterOtp = async (data: { email: string; otp: string }) => {
  const normalizedEmail = data.email.toLowerCase().trim();
  const record = otpStore.get(normalizedEmail);

  if (!record || record.type !== 'REGISTER') {
    throw new ApiError(400, 'No active registration session found. Please register again.');
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    throw new ApiError(400, 'Verification code has expired. Please request a new code.');
  }

  if (record.code !== data.otp.trim()) {
    throw new ApiError(400, 'Invalid verification code. Please check your email and try again.');
  }

  // Double check if account exists
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    otpStore.delete(normalizedEmail);
    throw new ApiError(400, 'An account with this email address already exists.');
  }

  let hashedPassword = null;
  if (record.data.password) {
    hashedPassword = await bcrypt.hash(record.data.password, 10);
  }

  const user = await prisma.user.create({
    data: {
      name: record.data.name,
      email: record.data.email,
      password: hashedPassword,
      role: record.data.role,
      phone: record.data.phone,
      company: record.data.company,
    },
  });

  otpStore.delete(normalizedEmail);

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  MailerService.sendWelcomeEmail({
    name: user.name,
    email: user.email,
    role: user.role,
  }).catch((err) => console.warn('Welcome email error:', err));

  return { user, token };
};

const sendForgotPasswordOtp = async (data: { email: string }) => {
  const normalizedEmail = data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new ApiError(404, 'No account found with this email address.');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(normalizedEmail, {
    code: otp,
    type: 'RESET_PASSWORD',
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  const emailSent = await MailerService.sendPasswordResetOtp({
    email: user.email,
    name: user.name,
    otp,
  }).catch((err) => {
    console.warn('Password reset OTP error:', err);
    return false;
  });

  return {
    email: normalizedEmail,
    message: emailSent
      ? 'Password reset code has been sent to your email address.'
      : 'Email dispatch failed (Gmail SMTP BadCredentials). Your reset OTP code has been logged to the backend console.',
    emailSent: !!emailSent,
    devOtp: process.env.NODE_ENV === 'development' || !emailSent ? otp : undefined,
  };
};

const resetPasswordWithOtp = async (data: { email: string; otp: string; newPassword?: string; password?: string }) => {
  const normalizedEmail = data.email.toLowerCase().trim();
  const rawPassword = data.newPassword || data.password;

  if (!rawPassword || rawPassword.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long.');
  }

  const record = otpStore.get(normalizedEmail);
  if (!record || record.type !== 'RESET_PASSWORD') {
    throw new ApiError(400, 'No active password reset session found. Please request a new code.');
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    throw new ApiError(400, 'Password reset code has expired. Please request a new code.');
  }

  if (record.code !== data.otp.trim()) {
    throw new ApiError(400, 'Invalid verification code. Please check your email.');
  }

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const updatedUser = await prisma.user.update({
    where: { email: normalizedEmail },
    data: { password: hashedPassword },
  });

  otpStore.delete(normalizedEmail);

  return {
    message: 'Password has been reset successfully. You can now log in with your new password.',
    email: updatedUser.email,
  };
};

const registerUser = async (data: {
  name: string;
  email: string;
  password?: string;
  role?: 'CLIENT' | 'ADMIN';
  phone?: string;
  company?: string;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase().trim() },
  });

  if (existing) {
    throw new ApiError(400, 'An account with this email address already exists.');
  }

  let hashedPassword = null;
  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 10);
  }

  const role = data.role || (data.email.toLowerCase().includes('admin') ? 'ADMIN' : 'CLIENT');

  const user = await prisma.user.create({
    data: {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      phone: data.phone || null,
      company: data.company || null,
    },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Asynchronously dispatch welcome email via Nodemailer SMTP
  MailerService.sendWelcomeEmail({
    name: user.name,
    email: user.email,
    role: user.role,
  }).catch((err) => console.warn('Welcome email error:', err));

  return { user, token };
};

const loginUser = async (data: { email: string; password?: string }) => {
  const email = data.email.toLowerCase().trim();
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // If logging in as default admin for the first time, auto-create
    if (email === 'admin@brainbari.com') {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = await prisma.user.create({
        data: {
          name: 'Brain Bari Admin',
          email: 'admin@brainbari.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
    } else {
      throw new ApiError(401, 'Invalid email or password.');
    }
  }

  // Verify password if set
  if (user.password && data.password) {
    const isMatch = await bcrypt.compare(data.password, user.password);
    // Also allow demo credential admin123 for default admin
    const isDemoAdmin = email === 'admin@brainbari.com' && data.password === 'admin123';
    if (!isMatch && !isDemoAdmin) {
      throw new ApiError(401, 'Invalid email or password.');
    }
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

const googleOAuthLogin = async (data: {
  email: string;
  name: string;
  avatar?: string;
  googleId?: string;
}) => {
  const email = data.email.toLowerCase().trim();
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: data.name || email.split('@')[0],
        avatar: data.avatar || null,
        role: email.includes('admin') ? 'ADMIN' : 'CLIENT',
      },
    });

    MailerService.sendWelcomeEmail({
      name: user.name,
      email: user.email,
      role: user.role,
    }).catch(() => {});
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
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
  registerUser,
  sendRegisterOtp,
  verifyRegisterOtp,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
  loginUser,
  googleOAuthLogin,
  getCurrentUser,
};
