import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UploadService } from './upload.service';

const uploadFile = catchAsync(async (req: Request, res: Response) => {
  const category = (req.body?.category as string) || 'General Assets';
  const folder = (req.body?.folder as string) || 'brain-bari';

  // 1. Multipart file upload from multer
  if (req.file) {
    const originalName = req.file.originalname || `upload_${Date.now()}`;
    const result = await UploadService.uploadBuffer(
      req.file.buffer,
      originalName,
      folder,
      category
    );

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'File successfully uploaded to Cloudinary.',
      data: result,
    });
  }

  // 2. Base64 / data URL in body
  const dataUrl = req.body?.dataUrl || req.body?.image || req.body?.file;
  if (dataUrl && typeof dataUrl === 'string') {
    const name = (req.body?.name as string) || `upload_${Date.now()}.jpg`;
    const result = await UploadService.uploadBase64OrUrl(
      dataUrl,
      name,
      folder,
      category
    );

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Image successfully uploaded to Cloudinary.',
      data: result,
    });
  }

  return res.status(400).json({
    success: false,
    message: 'No file or valid dataUrl provided in request.',
  });
});

const getAllMedia = catchAsync(async (req: Request, res: Response) => {
  const media = await UploadService.getAllMedia();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Media assets retrieved successfully from Cloudinary library.',
    data: media,
  });
});

const deleteMedia = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = await UploadService.deleteMedia(id);
  sendResponse(res, {
    statusCode: 200,
    success,
    message: success ? 'Media asset removed successfully.' : 'Media item not found.',
    data: null,
  });
});

export const UploadController = {
  uploadFile,
  getAllMedia,
  deleteMedia,
};
