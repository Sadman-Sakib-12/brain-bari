import { Router } from 'express';
import { ServiceController } from './service.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

router.get('/', ServiceController.getAllServices);
router.get('/:id', ServiceController.getService);
router.post('/', verifyToken, verifyAdmin, ServiceController.createService);
router.patch('/:id', verifyToken, verifyAdmin, ServiceController.updateService);
router.delete('/:id', verifyToken, verifyAdmin, ServiceController.deleteService);

export const ServiceRoutes = router;
