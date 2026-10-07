import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../../config/cloudinary';
import prisma from '../../config/prisma';

export interface UploadedMediaItem {
  id: string;
  name: string;
  title: string;
  type: 'image' | 'document';
  format: string;
  size: string;
  dimensions: string;
  url: string;
  category: string;
  publicId?: string;
  uploadedAt: string;
}

export const UploadService = {
  // Upload a buffer to Cloudinary
  uploadBuffer: async (
    buffer: Buffer,
    originalName: string,
    folder: string = 'brain-bari',
    category: string = 'General Assets'
  ): Promise<UploadedMediaItem> => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          overwrite: true,
        },
        async (error, result?: UploadApiResponse) => {
          if (error || !result) {
            return reject(error || new Error('Upload to Cloudinary failed.'));
          }

          const isDoc = result.resource_type === 'raw' || originalName.endsWith('.pdf');
          const sizeKB = `${Math.round(result.bytes / 1024)} KB`;
          const mediaItem: UploadedMediaItem = {
            id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: originalName,
            title: originalName.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '').toUpperCase(),
            type: isDoc ? 'document' : 'image',
            format: (result.format || originalName.split('.').pop() || 'JPG').toUpperCase(),
            size: sizeKB,
            dimensions: result.width && result.height ? `${result.width} x ${result.height}` : 'Vector/Doc',
            url: result.secure_url,
            category,
            publicId: result.public_id,
            uploadedAt: new Date().toISOString(),
          };

          // Save to NeonDB PostgreSQL cmsContent (key: 'media')
          try {
            const existingRecord = await prisma.cmsContent.findUnique({
              where: { key: 'media' },
            });

            let currentList: UploadedMediaItem[] = [];
            if (existingRecord && Array.isArray(existingRecord.data)) {
              currentList = existingRecord.data as any as UploadedMediaItem[];
            }

            const updatedList = [mediaItem, ...currentList];
            await prisma.cmsContent.upsert({
              where: { key: 'media' },
              update: { data: updatedList as any },
              create: { key: 'media', data: updatedList as any },
            });
          } catch (dbErr) {
            console.error('Failed to update media library in cmsContent:', dbErr);
          }

          resolve(mediaItem);
        }
      );

      uploadStream.end(buffer);
    });
  },

  // Upload base64 or URL
  uploadBase64OrUrl: async (
    dataOrUrl: string,
    name: string = 'uploaded_image',
    folder: string = 'brain-bari',
    category: string = 'General Assets'
  ): Promise<UploadedMediaItem> => {
    const result = await cloudinary.uploader.upload(dataOrUrl, {
      folder,
      resource_type: 'auto',
      overwrite: true,
    });

    const isDoc = result.resource_type === 'raw' || name.endsWith('.pdf');
    const sizeKB = `${Math.round(result.bytes / 1024)} KB`;
    const mediaItem: UploadedMediaItem = {
      id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name,
      title: name.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '').toUpperCase(),
      type: isDoc ? 'document' : 'image',
      format: (result.format || name.split('.').pop() || 'JPG').toUpperCase(),
      size: sizeKB,
      dimensions: result.width && result.height ? `${result.width} x ${result.height}` : 'Vector/Doc',
      url: result.secure_url,
      category,
      publicId: result.public_id,
      uploadedAt: new Date().toISOString(),
    };

    // Save to NeonDB PostgreSQL
    try {
      const existingRecord = await prisma.cmsContent.findUnique({
        where: { key: 'media' },
      });

      let currentList: UploadedMediaItem[] = [];
      if (existingRecord && Array.isArray(existingRecord.data)) {
        currentList = existingRecord.data as any as UploadedMediaItem[];
      }

      const updatedList = [mediaItem, ...currentList];
      await prisma.cmsContent.upsert({
        where: { key: 'media' },
        update: { data: updatedList as any },
        create: { key: 'media', data: updatedList as any },
      });
    } catch (dbErr) {
      console.error('Failed to update media library in cmsContent:', dbErr);
    }

    return mediaItem;
  },

  // Get all media library items from NeonDB
  getAllMedia: async (): Promise<UploadedMediaItem[]> => {
    const record = await prisma.cmsContent.findUnique({
      where: { key: 'media' },
    });

    if (record && Array.isArray(record.data)) {
      return record.data as any as UploadedMediaItem[];
    }
    return [];
  },

  // Delete media item from Cloudinary and NeonDB
  deleteMedia: async (id: string): Promise<boolean> => {
    const record = await prisma.cmsContent.findUnique({
      where: { key: 'media' },
    });

    if (!record || !Array.isArray(record.data)) {
      return false;
    }

    const list = record.data as any as UploadedMediaItem[];
    const target = list.find((m) => m.id === id || m.url === id || m.publicId === id);

    if (target?.publicId) {
      try {
        await cloudinary.uploader.destroy(target.publicId);
      } catch (cErr) {
        console.warn('Failed to delete from Cloudinary:', cErr);
      }
    }

    const updated = list.filter((m) => m.id !== id && m.url !== id && m.publicId !== id);
    await prisma.cmsContent.update({
      where: { key: 'media' },
      data: { data: updated as any },
    });

    return true;
  },
};
