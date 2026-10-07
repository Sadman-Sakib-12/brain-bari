import prisma from '../../config/prisma';

interface IServiceQueryParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  limit?: string;
  isActive?: string;
}

const getAllServices = async (query: IServiceQueryParams) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 100;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.isActive !== undefined) {
    where.isActive = query.isActive === 'true';
  }

  if (query.category) {
    where.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = Number(query.minPrice);
    if (query.maxPrice) where.price.lte = Number(query.maxPrice);
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { shortDesc: { contains: query.search, mode: 'insensitive' } },
      { category: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (query.sort === 'price_asc') {
    orderBy = { price: 'asc' };
  } else if (query.sort === 'price_desc') {
    orderBy = { price: 'desc' };
  } else if (query.sort === 'delivery_asc') {
    orderBy = { deliveryDays: 'asc' };
  } else if (query.sort === 'newest') {
    orderBy = { createdAt: 'desc' };
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    prisma.service.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: services,
  };
};

const getServiceByIdOrSlug = async (identifier: string) => {
  return await prisma.service.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
  });
};

const createService = async (data: {
  title: string;
  slug: string;
  category: string;
  shortDesc: string;
  fullDesc?: string;
  price: number;
  deliveryDays?: number;
  features?: string[];
  badge?: string;
  icon?: string;
  image?: string;
  isActive?: boolean;
}) => {
  return await prisma.service.create({
    data: {
      ...data,
      features: data.features || [],
      deliveryDays: data.deliveryDays || 7,
    },
  });
};

const updateService = async (id: string, data: any) => {
  return await prisma.service.update({
    where: { id },
    data,
  });
};

const deleteService = async (id: string) => {
  return await prisma.service.delete({
    where: { id },
  });
};

export const ServiceManager = {
  getAllServices,
  getServiceByIdOrSlug,
  createService,
  updateService,
  deleteService,
};
