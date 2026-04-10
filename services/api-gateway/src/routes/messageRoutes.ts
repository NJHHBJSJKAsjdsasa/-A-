import express from 'express';
import { createServiceProxy } from '../utils/proxy';
import { MESSAGE_SERVICE } from '../config';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Message routes - require auth
router.use('/messages', authMiddleware, createServiceProxy(MESSAGE_SERVICE));
router.use('/api/messages', authMiddleware, createServiceProxy(MESSAGE_SERVICE, { '^/api/messages': '/messages' }));
router.use('/conversations', authMiddleware, createServiceProxy(MESSAGE_SERVICE));
router.use('/api/conversations', authMiddleware, createServiceProxy(MESSAGE_SERVICE, { '^/api/conversations': '/conversations' }));

export default router;