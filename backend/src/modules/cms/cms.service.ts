import prisma from '../../config/prisma';
import { MailerService } from '../../utils/mailer';

// -------------------------------------------------------------
// 1. Site Settings
// -------------------------------------------------------------
const getSiteSettings = async () => {
  const fullContent = await prisma.cmsContent.findUnique({
    where: { key: 'siteSettings' },
  });
  if (fullContent && fullContent.data) {
    return fullContent.data;
  }
  return await prisma.siteSetting.findUnique({
    where: { id: 'default' },
  });
};

const updateSiteSettings = async (data: any) => {
  // Read existing data so partial updates never wipe out hero, footer, navbar, or other sections
  const existing = await prisma.cmsContent.findUnique({
    where: { key: 'siteSettings' },
  });
  const existingData = (existing?.data as Record<string, any>) || {};
  const mergedData: Record<string, any> = {
    ...existingData,
    ...data,
  };

  if (data.hero && typeof data.hero === 'object') {
    mergedData.hero = { ...(existingData.hero || {}), ...data.hero };
  }
  if (data.footer && typeof data.footer === 'object') {
    mergedData.footer = { ...(existingData.footer || {}), ...data.footer };
  }
  if (data.navbar && typeof data.navbar === 'object') {
    mergedData.navbar = { ...(existingData.navbar || {}), ...data.navbar };
  }
  if (data.homepageSections && typeof data.homepageSections === 'object') {
    mergedData.homepageSections = { ...(existingData.homepageSections || {}), ...data.homepageSections };
  }
  if (data.privacy && typeof data.privacy === 'object') {
    mergedData.privacy = { ...(existingData.privacy || {}), ...data.privacy };
  }
  if (data.workflow && typeof data.workflow === 'object') {
    mergedData.workflow = { ...(existingData.workflow || {}), ...data.workflow };
  }

  // Store full rich merged object in CmsContent for complete dynamic frontend rendering
  await prisma.cmsContent.upsert({
    where: { key: 'siteSettings' },
    update: { data: mergedData },
    create: { key: 'siteSettings', data: mergedData },
  });

  // Extract structured fields for relational SiteSetting table
  const updateData: any = {};
  if (mergedData.hero?.headline) updateData.heroHeadline = mergedData.hero.headline;
  if (mergedData.hero?.headlineGradient) updateData.heroSubheadline = mergedData.hero.headlineGradient;
  if (Array.isArray(mergedData.hero?.filterPills)) updateData.heroTags = mergedData.hero.filterPills;
  if (mergedData.phone) updateData.phone = mergedData.phone;
  if (mergedData.email) updateData.email = mergedData.email;
  if (mergedData.contact?.whatsapp) updateData.whatsapp = mergedData.contact.whatsapp;
  if (mergedData.address) updateData.address = mergedData.address;
  if (mergedData.socials) updateData.socialLinks = mergedData.socials;

  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: updateData,
    create: {
      id: 'default',
      ...updateData,
    },
  });

  return mergedData;
};

// -------------------------------------------------------------
// 2. Generic Dynamic CMS Content Store (Database Authority)
// -------------------------------------------------------------
const getContentByKey = async (key: string) => {
  const content = await prisma.cmsContent.findUnique({
    where: { key },
  });
  return content ? content.data : null;
};

const updateContentByKey = async (key: string, data: any) => {
  const result = await prisma.cmsContent.upsert({
    where: { key },
    update: { data },
    create: { key, data },
  });
  return result.data;
};

const getAllContent = async () => {
  const all = await prisma.cmsContent.findMany();
  const map: Record<string, any> = {};
  for (const item of all) {
    map[item.key] = item.data;
  }
  return map;
};

// -------------------------------------------------------------
// 3. Client Contact Messages
// -------------------------------------------------------------
const submitContactMessage = async (data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  selectedServices?: string[];
}) => {
  const message = await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      selectedServices: Array.isArray(data.selectedServices) ? data.selectedServices : [],
      status: 'UNREAD',
    },
  });

  // Asynchronously dispatch notification email via Nodemailer SMTP
  MailerService.sendContactNotification(data).catch((err) =>
    console.warn('Contact notification email error:', err)
  );

  return message;
};

const getAllContactMessages = async () => {
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const updateContactMessageStatus = async (id: string, status: string) => {
  return await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
};

const deleteContactMessage = async (id: string) => {
  return await prisma.contactMessage.delete({
    where: { id },
  });
};

export const CmsService = {
  getSiteSettings,
  updateSiteSettings,
  getContentByKey,
  updateContentByKey,
  getAllContent,
  submitContactMessage,
  getAllContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
};
