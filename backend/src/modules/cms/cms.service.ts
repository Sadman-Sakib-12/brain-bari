import prisma from '../../config/prisma';

const getSiteSettings = async () => {
  let settings = await prisma.siteSetting.findUnique({
    where: { id: 'default' },
  });

  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {
        id: 'default',
        heroHeadline: 'Deploy Autonomous AI Chatbots & Next-Gen Software Solutions',
        heroSubheadline:
          'From high-converting customer service AI agents to enterprise full-stack platforms, Botbari crafts scalable AI systems that accelerate your business growth.',
        heroTags: ['Enterprise Grade', '99.9% Uptime', 'Custom Trained LLM', 'Stripe Verified'],
        phone: '+880 1700-000000',
        email: 'contact@botbari.ai',
        whatsapp: '+8801700000000',
        address: 'Dhaka, Bangladesh',
        socialLinks: {
          twitter: 'https://twitter.com/botbari_ai',
          linkedin: 'https://linkedin.com/company/botbari',
          github: 'https://github.com/botbari',
        },
      },
    });
  }

  return settings;
};

const updateSiteSettings = async (data: any) => {
  return await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: data,
    create: {
      id: 'default',
      ...data,
    },
  });
};

export const CmsService = {
  getSiteSettings,
  updateSiteSettings,
};
