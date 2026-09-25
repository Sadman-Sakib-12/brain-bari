import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ChatbotService } from './chatbot.service';

const getAllChatbots = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatbotService.getAllChatbots(req.query as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chatbots retrieved successfully.',
    data: result,
  });
});

const getChatbotById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const chatbot = await ChatbotService.getChatbotById(id);
  if (!chatbot) {
    res.status(404).json({ success: false, message: 'Chatbot not found.' });
    return;
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chatbot details retrieved successfully.',
    data: chatbot,
  });
});

const createChatbot = catchAsync(async (req: Request, res: Response) => {
  const newChatbot = await ChatbotService.createChatbot(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'New chatbot product created successfully.',
    data: newChatbot,
  });
});

const updateChatbot = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedChatbot = await ChatbotService.updateChatbot(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chatbot updated successfully.',
    data: updatedChatbot,
  });
});

const deleteChatbot = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await ChatbotService.deleteChatbot(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chatbot deleted successfully.',
    data: null,
  });
});

export const ChatbotController = {
  getAllChatbots,
  getChatbotById,
  createChatbot,
  updateChatbot,
  deleteChatbot,
};
