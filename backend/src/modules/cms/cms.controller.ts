import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CmsService } from './cms.service';

const getSiteSettings = catchAsync(async (req: Request, res: Response) => {
  const settings = await CmsService.getSiteSettings();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Site settings retrieved successfully.',
    data: settings,
  });
});

const updateSiteSettings = catchAsync(async (req: Request, res: Response) => {
  const updated = await CmsService.updateSiteSettings(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Site settings updated successfully.',
    data: updated,
  });
});

export const CmsController = {
  getSiteSettings,
  updateSiteSettings,
};
