import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

router.get('/', verifyToken, verifyAdmin, AnalyticsController.getAdminDashboardAnalytics);
router.get('/admin-stats', verifyToken, verifyAdmin, AnalyticsController.getAdminDashboardAnalytics);

export const AnalyticsRoutes = router;
