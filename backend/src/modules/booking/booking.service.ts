import prisma from '../../config/prisma';
import { BookingStatus } from '@prisma/client';
import { MailerService } from '../../utils/mailer';

const createBooking = async (
  userId: string | null,
  data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    date: string;
    timeSlot: string;
    topic: string;
    message?: string;
  }
) => {
  const booking = await prisma.booking.create({
    data: {
      userId: userId || null,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      date: data.date,
      timeSlot: data.timeSlot,
      topic: data.topic,
      message: data.message,
      status: 'PENDING',
    },
  });

  MailerService.sendBookingNotification(booking).catch((err) =>
    console.warn('Booking notification email error:', err)
  );

  return booking;
};

const getMyBookings = async (email: string) => {
  return await prisma.booking.findMany({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });
};

const getAllBookingsForAdmin = async (query: { status?: string; search?: string }) => {
  const where: any = {};
  if (query.status && Object.values(BookingStatus).includes(query.status as BookingStatus)) {
    where.status = query.status as BookingStatus;
  }
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { topic: { contains: query.search, mode: 'insensitive' } },
      { company: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  return await prisma.booking.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

const updateBookingStatus = async (id: string, status: BookingStatus) => {
  return await prisma.booking.update({
    where: { id },
    data: { status },
  });
};

const deleteBooking = async (id: string) => {
  return await prisma.booking.delete({
    where: { id },
  });
};

export const BookingService = {
  createBooking,
  getMyBookings,
  getAllBookingsForAdmin,
  updateBookingStatus,
  deleteBooking,
};
