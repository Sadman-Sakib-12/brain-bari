import { Router } from 'express';
import { OrderController } from './order.controller';
import { verifyAdmin, verifyToken, optionalAuth } from '../../middlewares/auth';

const router = Router();

// Client routes (optional auth allows both guests and logged-in users to place orders)
router.post('/', optionalAuth, OrderController.createOrder);
router.get('/my-orders', verifyToken, OrderController.getMyOrders);
router.get('/:id', verifyToken, OrderController.getOrderById);
router.patch('/:id', verifyToken, OrderController.updateClientOrder);
router.delete('/:id', verifyToken, OrderController.deleteOrder);

// Admin review & quotation routes
router.get('/admin/all', verifyToken, verifyAdmin, OrderController.getAllOrdersForAdmin);
router.patch('/:id/quote', verifyToken, verifyAdmin, OrderController.setOrderQuoteByAdmin);

export const OrderRoutes = router;
