import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { BookingService } from './booking.service';
import { BookingStatus } from '@prisma/client';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user ? req.user.id : null;
  const newBooking = await BookingService.createBooking(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Consultation scheduled successfully! Our team will reach out to confirm.',
    data: newBooking,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const email = req.user!.email;
  const bookings = await BookingService.getMyBookings(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved successfully.',
    data: bookings,
  });
});

const getAllBookingsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const bookings = await BookingService.getAllBookingsForAdmin(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All consultation bookings retrieved for admin.',
    data: bookings,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  if (!status || !Object.values(BookingStatus).includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid booking status.' });
    return;
  }
  const updatedBooking = await BookingService.updateBookingStatus(id, status as BookingStatus);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Booking status updated to ${status}.`,
    data: updatedBooking,
  });
});

const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await BookingService.deleteBooking(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking deleted successfully.',
    data: null,
  });
});

export const BookingController = {
  createBooking,
  getMyBookings,
  getAllBookingsForAdmin,
  updateBookingStatus,
  deleteBooking,
};
