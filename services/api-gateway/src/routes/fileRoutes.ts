import express from 'express';
import { createServiceProxy } from '../utils/proxy';
import { FILE_SERVICE } from '../config';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// File routes - require auth
router.use('/files', authMiddleware, createServiceProxy(FILE_SERVICE));
router.use('/api/files', authMiddleware, createServiceProxy(FILE_SERVICE, { '^/api/files': '/files' }));

export default router;