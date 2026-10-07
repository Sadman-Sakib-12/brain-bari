import prisma from '../../config/prisma';

interface IBlogQueryParams {
  search?: string;
  isPublished?: string;
  page?: string;
  limit?: string;
  tag?: string;
}

const getAllBlogs = async (query: IBlogQueryParams) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (query.isPublished !== undefined) {
    where.isPublished = query.isPublished === 'true';
  }
  if (query.tag) {
    where.tags = { has: query.tag };
  }
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { content: { contains: query.search, mode: 'insensitive' } },
      { excerpt: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.blog.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: blogs,
  };
};

const getBlogByIdOrSlug = async (identifier: string) => {
  return await prisma.blog.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
  });
};

const createBlog = async (data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
}) => {
  return await prisma.blog.create({
    data: {
      ...data,
      author: data.author || 'Brain Bari Team',
      tags: data.tags || [],
    },
  });
};

const updateBlog = async (id: string, data: any) => {
  return await prisma.blog.update({
    where: { id },
    data,
  });
};

const deleteBlog = async (id: string) => {
  return await prisma.blog.delete({
    where: { id },
  });
};

export const BlogService = {
  getAllBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
