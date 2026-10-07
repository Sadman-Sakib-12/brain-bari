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

const sanitizePortfolioData = (raw: any) => {
  const title = raw.title;
  const slug = raw.slug || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const category = raw.category || 'AI & Automation';
  const description = raw.description || raw.overview || raw.shortDesc || 'Custom Enterprise AI & Software Solution';
  const client = raw.client || null;
  const liveUrl = raw.liveUrl || null;
  const thumbnail = raw.thumbnail || raw.image || null;
  const tags = Array.isArray(raw.tags) && raw.tags.length > 0
    ? raw.tags
    : Array.isArray(raw.techStack)
    ? raw.techStack
    : [];
  const featured = typeof raw.featured === 'boolean'
    ? raw.featured
    : typeof raw.isFeatured === 'boolean'
    ? raw.isFeatured
    : false;

  return {
    title,
    slug,
    category,
    description,
    client,
    liveUrl,
    thumbnail,
    tags,
    featured,
  };
};

const getPortfolioByIdOrSlug = async (identifier: string) => {
  const p = await prisma.portfolio.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
  });
  if (!p) return null;

  try {
    const extra = await prisma.cmsContent.findUnique({
      where: { key: `portfolio_extra_${p.slug}` },
    });
    if (extra && extra.data && typeof extra.data === 'object') {
      return { ...(extra.data as object), ...p };
    }
  } catch {}

  return p;
};

const createPortfolio = async (raw: any) => {
  const prismaData = sanitizePortfolioData(raw);
  const created = await prisma.portfolio.create({
    data: prismaData,
  });

  try {
    await prisma.cmsContent.upsert({
      where: { key: `portfolio_extra_${created.slug}` },
      update: { data: raw },
      create: { key: `portfolio_extra_${created.slug}`, data: raw },
    });
  } catch (err) {
    console.warn('Failed to save portfolio extra details:', err);
  }

  return created;
};

const updatePortfolio = async (id: string, raw: any) => {
  const prismaData = sanitizePortfolioData(raw);
  const updated = await prisma.portfolio.update({
    where: { id },
    data: prismaData,
  });

  try {
    await prisma.cmsContent.upsert({
      where: { key: `portfolio_extra_${updated.slug}` },
      update: { data: raw },
      create: { key: `portfolio_extra_${updated.slug}`, data: raw },
    });
  } catch (err) {
    console.warn('Failed to save portfolio extra details:', err);
  }

  return updated;
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
