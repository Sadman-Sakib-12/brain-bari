import { Router } from 'express';
import { ProductController } from './product.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', verifyToken, verifyAdmin, ProductController.createProduct);
router.patch('/:id', verifyToken, verifyAdmin, ProductController.updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, ProductController.deleteProduct);

export const ProductRoutes = router;
