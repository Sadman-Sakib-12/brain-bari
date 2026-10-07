import prisma from '../../config/prisma';

const getAllProducts = async (query: { category?: string; status?: string; search?: string }) => {
  const where: any = {};
  if (query.category) {
    where.category = query.category;
  }
  if (query.status) {
    where.status = query.status;
  }
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { tagline: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  return await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

const getProductById = async (id: string) => {
  return await prisma.product.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
  });
};

const createProduct = async (data: any) => {
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return await prisma.product.create({
    data: {
      title: data.title,
      slug,
      tagline: data.tagline || null,
      category: data.category || 'AI SaaS',
      description: data.description || '',
      features: Array.isArray(data.features) ? data.features : [],
      status: data.status || 'Production Ready',
      demoUrl: data.demoUrl || null,
      logo: data.logo || null,
      isFeatured: Boolean(data.isFeatured),
    },
  });
};

const updateProduct = async (id: string, data: any) => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};

const deleteProduct = async (id: string) => {
  return await prisma.product.delete({
    where: { id },
  });
};

export const ProductService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
