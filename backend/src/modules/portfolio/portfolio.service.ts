import prisma from '../../config/prisma';

const getAllPortfolios = async (query: { category?: string; featured?: string; search?: string }) => {
  const where: any = {};
  if (query.featured !== undefined) {
    where.featured = query.featured === 'true';
  }
  if (query.category) {
    where.category = query.category;
  }
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { client: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  return await prisma.portfolio.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

const getPortfolioByIdOrSlug = async (identifier: string) => {
  return await prisma.portfolio.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
  });
};

const createPortfolio = async (data: {
  title: string;
  slug: string;
  category: string;
  description: string;
  client?: string;
  liveUrl?: string;
  thumbnail?: string;
  tags?: string[];
  featured?: boolean;
}) => {
  return await prisma.portfolio.create({
    data: {
      ...data,
      tags: data.tags || [],
    },
  });
};

const updatePortfolio = async (id: string, data: any) => {
  return await prisma.portfolio.update({
    where: { id },
    data,
  });
};

const deletePortfolio = async (id: string) => {
  return await prisma.portfolio.delete({
    where: { id },
  });
};

export const PortfolioService = {
  getAllPortfolios,
  getPortfolioByIdOrSlug,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
};
