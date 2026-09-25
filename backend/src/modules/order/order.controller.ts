import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const newOrder = await OrderService.createOrder(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order submitted successfully. Our team will review and provide a quote soon.',
    data: newOrder,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const orders = await OrderService.getMyOrders(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My orders retrieved successfully.',
    data: orders,
  });
});

const getAllOrdersForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrdersForAdmin(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All orders retrieved successfully for admin review.',
    meta: result.meta,
    data: result.data,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const order = await OrderService.getOrderById(id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found.' });
    return;
  }
  // Client can only view their own order
  if (req.user?.role !== 'ADMIN' && order.userId !== req.user?.id) {
    res.status(403).json({ success: false, message: 'Access denied.' });
    return;
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrieved successfully.',
    data: order,
  });
});

const updateClientOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const updatedOrder = await OrderService.updateClientOrder(id, userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order requirements updated successfully.',
    data: updatedOrder,
  });
});

const setOrderQuoteByAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedOrder = await OrderService.setOrderQuoteByAdmin(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Order quote updated to ${req.body.status}.`,
    data: updatedOrder,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const isAdmin = req.user?.role === 'ADMIN';
  await OrderService.deleteOrder(id, userId, isAdmin);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order deleted/cancelled successfully.',
    data: null,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getAllOrdersForAdmin,
  getOrderById,
  updateClientOrder,
  setOrderQuoteByAdmin,
  deleteOrder,
};
