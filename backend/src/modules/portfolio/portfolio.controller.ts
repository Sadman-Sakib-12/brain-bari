import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PortfolioService } from './portfolio.service';

const getAllPortfolios = catchAsync(async (req: Request, res: Response) => {
  const result = await PortfolioService.getAllPortfolios(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Portfolios retrieved successfully.',
    data: result,
  });
});

const getPortfolio = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const portfolio = await PortfolioService.getPortfolioByIdOrSlug(id);
  if (!portfolio) {
    res.status(404).json({ success: false, message: 'Portfolio item not found.' });
    return;
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Portfolio details retrieved successfully.',
    data: portfolio,
  });
});

const createPortfolio = catchAsync(async (req: Request, res: Response) => {
  const newPortfolio = await PortfolioService.createPortfolio(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Portfolio item created successfully.',
    data: newPortfolio,
  });
});

const updatePortfolio = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedPortfolio = await PortfolioService.updatePortfolio(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Portfolio item updated successfully.',
    data: updatedPortfolio,
  });
});

const deletePortfolio = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await PortfolioService.deletePortfolio(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Portfolio item deleted successfully.',
    data: null,
  });
});

export const PortfolioController = {
  getAllPortfolios,
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
};
