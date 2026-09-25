import { Router } from 'express';
import { PortfolioController } from './portfolio.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

router.get('/', PortfolioController.getAllPortfolios);
router.get('/:id', PortfolioController.getPortfolio);
router.post('/', verifyToken, verifyAdmin, PortfolioController.createPortfolio);
router.patch('/:id', verifyToken, verifyAdmin, PortfolioController.updatePortfolio);
router.delete('/:id', verifyToken, verifyAdmin, PortfolioController.deletePortfolio);

export const PortfolioRoutes = router;
