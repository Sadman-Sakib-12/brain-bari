import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

router.post(
  '/jwt',
  validateRequest(authValidation.createOrLoginSchema),
  AuthController.syncAndGetToken
);

router.post('/logout', AuthController.logout);

router.get('/me', verifyToken, AuthController.getProfile);

export const AuthRoutes = router;
