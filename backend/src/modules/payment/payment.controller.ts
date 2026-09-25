import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { orderId } = req.body;
  if (!orderId) {
    res.status(400).json({ success: false, message: 'orderId is required.' });
    return;
  }
  const result = await PaymentService.createPaymentIntent(orderId, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Stripe payment intent created successfully.',
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await PaymentService.recordSuccessfulPayment(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment verified and recorded successfully.',
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const payments = await PaymentService.getMyPayments(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment history retrieved successfully.',
    data: payments,
  });
});

const getAllPaymentsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPaymentsForAdmin(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All platform payments retrieved for admin.',
    meta: result.meta,
    data: result.data,
  });
});

export const PaymentController = {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getAllPaymentsForAdmin,
};
