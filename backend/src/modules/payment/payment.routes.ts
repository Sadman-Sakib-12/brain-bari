import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

router.post('/create-intent', verifyToken, PaymentController.createPaymentIntent);
router.post('/confirm', verifyToken, PaymentController.confirmPayment);
router.get('/my-history', verifyToken, PaymentController.getMyPayments);
router.get('/admin/all', verifyToken, verifyAdmin, PaymentController.getAllPaymentsForAdmin);

export const PaymentRoutes = router;
