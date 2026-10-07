import { Router } from 'express';
import { UserController } from './user.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

router.post('/', verifyToken, verifyAdmin, UserController.createUser);
router.get('/', verifyToken, verifyAdmin, UserController.getAllUsers);
router.get('/:id', verifyToken, UserController.getUserById);
router.patch('/:id/role', verifyToken, verifyAdmin, UserController.updateUserRole);
router.patch('/:id/profile', verifyToken, UserController.updateUserProfile);
router.delete('/:id', verifyToken, verifyAdmin, UserController.deleteUser);

export const UserRoutes = router;
