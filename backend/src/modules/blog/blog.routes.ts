import { Router } from 'express';
import { BlogController } from './blog.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

router.get('/', BlogController.getAllBlogs);
router.get('/:id', BlogController.getBlog);
router.post('/', verifyToken, verifyAdmin, BlogController.createBlog);
router.patch('/:id', verifyToken, verifyAdmin, BlogController.updateBlog);
router.delete('/:id', verifyToken, verifyAdmin, BlogController.deleteBlog);

export const BlogRoutes = router;
