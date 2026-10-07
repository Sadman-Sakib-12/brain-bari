import { Router } from 'express';
import { CmsController } from './cms.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

// Site settings
router.get('/settings', CmsController.getSiteSettings);
router.patch('/settings', verifyToken, verifyAdmin, CmsController.updateSiteSettings);

// Client contact inquiry
router.post('/contact', CmsController.submitContactMessage);
router.get('/contact/all', verifyToken, verifyAdmin, CmsController.getAllContactMessages);
router.patch('/contact/:id/status', verifyToken, verifyAdmin, CmsController.updateContactMessageStatus);
router.delete('/contact/:id', verifyToken, verifyAdmin, CmsController.deleteContactMessage);

// Generic CMS content sections
router.get('/content', CmsController.getAllContent);
router.get('/content/:key', CmsController.getContentByKey);
router.put('/content/:key', verifyToken, verifyAdmin, CmsController.updateContentByKey);
router.patch('/content/:key', verifyToken, verifyAdmin, CmsController.updateContentByKey);

export const CmsRoutes = router;
