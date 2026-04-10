import express from 'express';
import { createServiceProxy } from '../utils/proxy';
import { LEARNING_SERVICE } from '../config';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Learning routes - GET (no auth)
router.get('/courses', createServiceProxy(LEARNING_SERVICE));
router.get('/api/courses', createServiceProxy(LEARNING_SERVICE, { '^/api/courses': '/courses' }));
router.get('/courses/:id', createServiceProxy(LEARNING_SERVICE));
router.get('/api/courses/:id', createServiceProxy(LEARNING_SERVICE, { '^/api/courses': '/courses' }));
router.get('/lessons/:id', createServiceProxy(LEARNING_SERVICE));
router.get('/api/lessons/:id', createServiceProxy(LEARNING_SERVICE, { '^/api/lessons': '/lessons' }));

// Learning routes - POST/PUT/DELETE (require auth)
router.use('/learning', authMiddleware, createServiceProxy(LEARNING_SERVICE));
router.use('/api/learning', authMiddleware, createServiceProxy(LEARNING_SERVICE, { '^/api/learning': '/learning' }));

export default router;