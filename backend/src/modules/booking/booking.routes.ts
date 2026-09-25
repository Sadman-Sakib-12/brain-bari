import { Router } from 'express';
import { BookingController } from './booking.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

// Public / client booking (optional auth token can be attached if logged in)
router.post('/', BookingController.createBooking);
router.get('/my-bookings', verifyToken, BookingController.getMyBookings);

// Admin routes
router.get('/admin/all', verifyToken, verifyAdmin, BookingController.getAllBookingsForAdmin);
router.patch('/:id/status', verifyToken, verifyAdmin, BookingController.updateBookingStatus);
router.delete('/:id', verifyToken, verifyAdmin, BookingController.deleteBooking);

export const BookingRoutes = router;
