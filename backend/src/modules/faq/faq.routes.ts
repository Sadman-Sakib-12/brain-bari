import { Router } from 'express';
import { FaqController } from './faq.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

router.get('/', FaqController.getAllFaqs);
router.get('/:id', FaqController.getFaqById);
router.post('/', verifyToken, verifyAdmin, FaqController.createFaq);
router.patch('/:id', verifyToken, verifyAdmin, FaqController.updateFaq);
router.delete('/:id', verifyToken, verifyAdmin, FaqController.deleteFaq);

export const FaqRoutes = router;
