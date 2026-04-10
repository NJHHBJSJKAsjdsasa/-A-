import express from 'express';
import { createServiceProxy } from '../utils/proxy';
import { USER_SERVICE } from '../config';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// User routes - require auth
router.use('/users', authMiddleware, createServiceProxy(USER_SERVICE));
router.use('/api/users', authMiddleware, createServiceProxy(USER_SERVICE, { '^/api/users': '/users' }));

export default router;