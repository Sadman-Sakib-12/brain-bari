import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AnalyticsService } from './analytics.service';

const getAdminDashboardAnalytics = catchAsync(async (req: Request, res: Response) => {
  const data = await AnalyticsService.getAdminDashboardAnalytics();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin dashboard analytics retrieved successfully.',
    data,
  });
});

export const AnalyticsController = {
  getAdminDashboardAnalytics,
};
