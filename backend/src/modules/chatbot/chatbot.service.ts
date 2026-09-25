import prisma from '../../config/prisma';

const getAllChatbots = async (query: { category?: string; search?: string; isActive?: string }) => {
  const where: any = {};
  if (query.isActive !== undefined) {
    where.isActive = query.isActive === 'true';
  }
  if (query.category) {
    where.category = query.category;
  }
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  return await prisma.chatbot.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

const getChatbotById = async (id: string) => {
  return await prisma.chatbot.findUnique({
    where: { id },
  });
};

const createChatbot = async (data: {
  name: string;
  category: string;
  price: number;
  deliveryTime?: string;
  tags?: string[];
  description: string;
  image?: string;
  liveDemo?: string;
  isActive?: boolean;
}) => {
  return await prisma.chatbot.create({
    data: {
      ...data,
      deliveryTime: data.deliveryTime || '3-5 Days',
      tags: data.tags || [],
    },
  });
};

const updateChatbot = async (id: string, data: any) => {
  return await prisma.chatbot.update({
    where: { id },
    data,
  });
};

const deleteChatbot = async (id: string) => {
  return await prisma.chatbot.delete({
    where: { id },
  });
};

export const ChatbotService = {
  getAllChatbots,
  getChatbotById,
  createChatbot,
  updateChatbot,
  deleteChatbot,
};
