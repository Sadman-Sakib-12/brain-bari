import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/register-otp', AuthController.sendRegisterOtp);
router.post('/verify-register-otp', AuthController.verifyRegisterOtp);
router.post('/forgot-password', AuthController.sendForgotPasswordOtp);
router.post('/reset-password', AuthController.resetPasswordWithOtp);
router.post('/login', AuthController.login);
router.post('/google', AuthController.googleAuth);

router.post(
  '/jwt',
  validateRequest(authValidation.createOrLoginSchema),
  AuthController.syncAndGetToken
);

router.post('/logout', AuthController.logout);

router.get('/me', verifyToken, AuthController.getProfile);
router.get('/session', (req, res) => res.status(200).json({ user: null, authenticated: false }));
router.get('/csrf', (req, res) => res.status(200).json({ csrfToken: '' }));

export const AuthRoutes = router;
