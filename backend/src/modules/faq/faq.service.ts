import prisma from '../../config/prisma';

const getAllFaqs = async (query: { category?: string; isActive?: string }) => {
  const where: any = {};
  if (query.isActive !== undefined) {
    where.isActive = query.isActive === 'true';
  }
  if (query.category) {
    where.category = query.category;
  }

  return await prisma.faq.findMany({
    where,
    orderBy: { orderIndex: 'asc' },
  });
};

const getFaqById = async (id: string) => {
  return await prisma.faq.findUnique({
    where: { id },
  });
};

const createFaq = async (data: {
  question: string;
  answer: string;
  category?: string;
  orderIndex?: number;
  isActive?: boolean;
}) => {
  return await prisma.faq.create({
    data: {
      ...data,
      category: data.category || 'General',
      orderIndex: data.orderIndex || 0,
    },
  });
};

const updateFaq = async (id: string, data: any) => {
  return await prisma.faq.update({
    where: { id },
    data,
  });
};

const deleteFaq = async (id: string) => {
  return await prisma.faq.delete({
    where: { id },
  });
};

export const FaqService = {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};
