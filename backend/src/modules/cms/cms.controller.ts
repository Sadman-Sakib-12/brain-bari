import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CmsService } from './cms.service';

const getSiteSettings = catchAsync(async (req: Request, res: Response) => {
  const settings = await CmsService.getSiteSettings();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Site settings retrieved successfully from database.',
    data: settings,
  });
});

const updateSiteSettings = catchAsync(async (req: Request, res: Response) => {
  const updated = await CmsService.updateSiteSettings(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Site settings saved to database successfully.',
    data: updated,
  });
});

const getContentByKey = catchAsync(async (req: Request, res: Response) => {
  const { key } = req.params;
  const content = await CmsService.getContentByKey(key as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `CMS content for '${key}' retrieved successfully.`,
    data: content,
  });
});

const updateContentByKey = catchAsync(async (req: Request, res: Response) => {
  const { key } = req.params;
  const content = await CmsService.updateContentByKey(key as string, req.body.data !== undefined ? req.body.data : req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `CMS content for '${key}' updated successfully.`,
    data: content,
  });
});

const getAllContent = catchAsync(async (req: Request, res: Response) => {
  const allContent = await CmsService.getAllContent();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All CMS content sections retrieved successfully.',
    data: allContent,
  });
});

const submitContactMessage = catchAsync(async (req: Request, res: Response) => {
  const message = await CmsService.submitContactMessage(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Thank you! Your message has been received.',
    data: message,
  });
});

const getAllContactMessages = catchAsync(async (req: Request, res: Response) => {
  const messages = await CmsService.getAllContactMessages();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All contact messages retrieved successfully for admin.',
    data: messages,
  });
});

const updateContactMessageStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await CmsService.updateContactMessageStatus(id as string, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact message status updated.',
    data: updated,
  });
});

const deleteContactMessage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CmsService.deleteContactMessage(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact message deleted.',
    data: null,
  });
});

export const CmsController = {
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
