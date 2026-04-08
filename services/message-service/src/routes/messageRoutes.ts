import { Router } from 'express';
import { body } from 'express-validator';
import {
  getConversations,
  getConversation,
  createConversation,
  getMessages,
  sendMessage,
  markAsRead,
  getUnreadCount
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/conversations', authenticate, getConversations);
router.get('/conversations/:id', authenticate, getConversation);
router.post(
  '/conversations',
  authenticate,
  [body('participants').isArray({ min: 1 }).withMessage('Participants are required')],
  createConversation
);

router.get('/conversations/:conversationId/messages', authenticate, getMessages);
router.post(
  '/conversations/:conversationId/messages',
  authenticate,
  [body('content').notEmpty().withMessage('Content is required')],
  sendMessage
);
router.put('/conversations/:conversationId/read', authenticate, markAsRead);

router.get('/unread', authenticate, getUnreadCount);

export default router;
