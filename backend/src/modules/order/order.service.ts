import prisma from '../../config/prisma';
import { OrderStatus } from '@prisma/client';
import { ApiError } from '../../middlewares/errorHandler';
import { MailerService } from '../../utils/mailer';

const createOrder = async (
  userId: string | undefined,
  data: {
    serviceName: string;
    category?: string;
    requirements?: string;
    budget?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    name?: string;
    email?: string;
    phone?: string;
  }
) => {
  const newOrder = await prisma.order.create({
    data: {
      userId: (userId as any) || undefined,
      clientName: data.clientName || data.name || null,
      clientEmail: data.clientEmail || data.email || null,
      clientPhone: data.clientPhone || data.phone || null,
      serviceName: data.serviceName,
      category: data.category || 'ai-services',
      requirements: data.requirements || 'Standard inquiry',
      budget: data.budget || 'Custom Quote',
      status: 'PENDING',
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // Asynchronously dispatch notification emails to Admin and Client via Nodemailer SMTP
  MailerService.sendOrderNotification({
    id: newOrder.id,
    serviceName: newOrder.serviceName,
    category: newOrder.category,
    requirements: newOrder.requirements,
    budget: newOrder.budget,
    clientName: newOrder.clientName || newOrder.user?.name || 'Valued Client',
    clientEmail: newOrder.clientEmail || newOrder.user?.email || null,
    clientPhone: newOrder.clientPhone || null,
    createdAt: newOrder.createdAt,
  }).catch((err) => console.warn('Order notification email error:', err));

  return newOrder;
};

const getMyOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      payments: true,
    },
  });
};

const getAllOrdersForAdmin = async (query: { status?: string; search?: string; page?: string; limit?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (query.status && Object.values(OrderStatus).includes(query.status as OrderStatus)) {
    where.status = query.status as OrderStatus;
  }
  if (query.search) {
    where.OR = [
      { serviceName: { contains: query.search, mode: 'insensitive' } },
      { requirements: { contains: query.search, mode: 'insensitive' } },
      { clientName: { contains: query.search, mode: 'insensitive' } },
      { clientEmail: { contains: query.search, mode: 'insensitive' } },
      { user: { name: { contains: query.search, mode: 'insensitive' } } },
      { user: { email: { contains: query.search, mode: 'insensitive' } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, company: true } },
        payments: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: orders,
  };
};

const getOrderById = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, company: true } },
      payments: true,
    },
  });
};

const updateClientOrder = async (
  id: string,
  userId: string,
  data: { requirements?: string; budget?: string; serviceName?: string }
) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  if (order.userId !== userId) {
    throw new ApiError(403, 'Forbidden. You do not own this order.');
  }
  if (order.status !== 'PENDING') {
    throw new ApiError(400, 'Only pending orders can be updated by the client.');
  }

  return await prisma.order.update({
    where: { id },
    data,
  });
};

const setOrderQuoteByAdmin = async (
  id: string,
  data: {
    status?: string;
    quotePrice?: number;
    quotedPrice?: number;
    deliveryTime?: string;
    rejectionNote?: string;
  }
) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Gracefully accept either quotePrice or quotedPrice
  const rawPrice = data.quotePrice !== undefined ? data.quotePrice : data.quotedPrice;
  const quotePrice = rawPrice !== undefined && rawPrice !== null ? Number(rawPrice) : order.quotePrice;

  // Normalize status (e.g., "Approved" -> "APPROVED", "In Progress" -> "IN_PROGRESS")
  let normalizedStatus: OrderStatus = order.status;
  if (data.status) {
    const candidate = data.status.trim().toUpperCase().replace(/\s+/g, '_') as OrderStatus;
    if (Object.values(OrderStatus).includes(candidate)) {
      normalizedStatus = candidate;
    }
  }

  return await prisma.order.update({
    where: { id },
    data: {
      status: normalizedStatus,
      quotePrice,
      deliveryTime: data.deliveryTime || order.deliveryTime,
      rejectionNote: data.rejectionNote || order.rejectionNote,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

const deleteOrder = async (id: string, userId: string, isAdmin: boolean) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  if (!isAdmin && order.userId !== userId) {
    throw new ApiError(403, 'Forbidden. You cannot delete this order.');
  }
  if (!isAdmin && order.status !== 'PENDING') {
    throw new ApiError(400, 'Only pending orders can be cancelled by the client.');
  }

  return await prisma.order.delete({
    where: { id },
  });
};

export const OrderService = {
  createOrder,
  getMyOrders,
  getAllOrdersForAdmin,
  getOrderById,
  updateClientOrder,
  setOrderQuoteByAdmin,
  deleteOrder,
};
