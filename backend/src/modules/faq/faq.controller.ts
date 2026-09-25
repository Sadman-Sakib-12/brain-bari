import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { FaqService } from './faq.service';

const getAllFaqs = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.getAllFaqs(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FAQs retrieved successfully.',
    data: result,
  });
});

const getFaqById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const faq = await FaqService.getFaqById(id);
  if (!faq) {
    res.status(404).json({ success: false, message: 'FAQ not found.' });
    return;
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FAQ retrieved successfully.',
    data: faq,
  });
});

const createFaq = catchAsync(async (req: Request, res: Response) => {
  const newFaq = await FaqService.createFaq(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'FAQ created successfully.',
    data: newFaq,
  });
});

const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedFaq = await FaqService.updateFaq(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FAQ updated successfully.',
    data: updatedFaq,
  });
});

const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await FaqService.deleteFaq(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'FAQ deleted successfully.',
    data: null,
  });
});

export const FaqController = {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};
