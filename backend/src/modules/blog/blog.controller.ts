import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { BlogService } from './blog.service';

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getAllBlogs(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs retrieved successfully.',
    meta: result.meta,
    data: result.data,
  });
});

const getBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const blog = await BlogService.getBlogByIdOrSlug(id);
  if (!blog) {
    res.status(404).json({ success: false, message: 'Blog article not found.' });
    return;
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog article retrieved successfully.',
    data: blog,
  });
});

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const newBlog = await BlogService.createBlog(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Blog article published successfully.',
    data: newBlog,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedBlog = await BlogService.updateBlog(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog article updated successfully.',
    data: updatedBlog,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await BlogService.deleteBlog(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog article deleted successfully.',
    data: null,
  });
});

export const BlogController = {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};
