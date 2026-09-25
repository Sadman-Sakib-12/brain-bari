import { Router } from 'express';
import { ChatbotController } from './chatbot.controller';
import { verifyAdmin, verifyToken } from '../../middlewares/auth';

const router = Router();

router.get('/', ChatbotController.getAllChatbots);
router.get('/:id', ChatbotController.getChatbotById);
router.post('/', verifyToken, verifyAdmin, ChatbotController.createChatbot);
router.patch('/:id', verifyToken, verifyAdmin, ChatbotController.updateChatbot);
router.delete('/:id', verifyToken, verifyAdmin, ChatbotController.deleteChatbot);

export const ChatbotRoutes = router;
