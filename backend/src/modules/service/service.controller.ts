import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ServiceManager } from './service.service';

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceManager.getAllServices(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Services retrieved successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const service = await ServiceManager.getServiceByIdOrSlug(id);
  if (!service) {
    res.status(404).json({ success: false, message: 'Service not found.' });
    return;
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service details retrieved successfully.',
    data: service,
  });
});

const createService = catchAsync(async (req: Request, res: Response) => {
  const newService = await ServiceManager.createService(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'New service created successfully.',
    data: newService,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedService = await ServiceManager.updateService(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service updated successfully.',
    data: updatedService,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await ServiceManager.deleteService(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service deleted successfully.',
    data: null,
  });
});

export const ServiceController = {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
};
