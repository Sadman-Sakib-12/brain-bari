import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ProductService } from './product.service';

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products retrieved successfully.',
    data: result,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProductById(req.params.id as string);
  if (!result) {
    res.status(404).json({ success: false, message: 'Product not found.' });
    return;
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully.',
    data: result,
  });
});

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully.',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProduct(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully.',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await ProductService.deleteProduct(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully.',
    data: null,
  });
});

export const ProductController = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
