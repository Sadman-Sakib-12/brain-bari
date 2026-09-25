import { Router } from 'express';
import { CmsController } from './cms.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

router.get('/settings', CmsController.getSiteSettings);
router.patch('/settings', verifyToken, verifyAdmin, CmsController.updateSiteSettings);

export const CmsRoutes = router;
