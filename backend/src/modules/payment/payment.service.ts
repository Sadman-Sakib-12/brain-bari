import Stripe from 'stripe';
import prisma from '../../config/prisma';
import { config } from '../../config';
import { ApiError } from '../../middlewares/errorHandler';

const stripe = new Stripe(config.stripe.secret_key || 'sk_test_placeholder_key', {
  apiVersion: '2025-02-24.acacia' as any,
});

const createPaymentIntent = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.userId !== userId) {
    throw new ApiError(403, 'Forbidden. You do not own this order.');
  }

  if (order.status !== 'APPROVED') {
    throw new ApiError(400, 'Order has not been approved with quotation yet.');
  }

  if (!order.quotePrice || order.quotePrice <= 0) {
    throw new ApiError(400, 'Invalid quotation price for this order.');
  }

  const amountInCents = Math.round(order.quotePrice * 100);

  // If a valid Stripe secret is configured, create real intent; else mock client secret for local testing
  let clientSecret = 'mock_pi_secret_' + Date.now();
  if (config.stripe.secret_key && config.stripe.secret_key.startsWith('sk_')) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: order.userId,
        serviceName: order.serviceName,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    clientSecret = paymentIntent.client_secret || clientSecret;
  }

  return {
    clientSecret,
    amount: order.quotePrice,
    orderId: order.id,
    serviceName: order.serviceName,
  };
};

const recordSuccessfulPayment = async (
  userId: string,
  data: {
    orderId: string;
    transactionId: string;
    amount: number;
    paymentMethod?: string;
  }
) => {
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Create payment record and update order status to IN_PROGRESS in a transaction
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        orderId: data.orderId,
        userId,
        transactionId: data.transactionId,
        amount: data.amount,
        currency: 'usd',
        status: 'COMPLETED',
        paymentMethod: data.paymentMethod || 'card',
      },
    });

    const updatedOrder = await tx.order.update({
      where: { id: data.orderId },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    return { payment, order: updatedOrder };
  });
};

const getMyPayments = async (userId: string) => {
  return await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      order: {
        select: {
          id: true,
          serviceName: true,
          category: true,
          status: true,
        },
      },
    },
  });
};

const getAllPaymentsForAdmin = async (query: { page?: string; limit?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, serviceName: true, category: true, status: true } },
      },
    }),
    prisma.payment.count(),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: payments,
  };
};

export const PaymentService = {
  createPaymentIntent,
  recordSuccessfulPayment,
  getMyPayments,
  getAllPaymentsForAdmin,
};
