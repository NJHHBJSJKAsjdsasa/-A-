import express from 'express';
import { createServiceProxy } from '../utils/proxy';
import { ACHIEVEMENT_SERVICE } from '../config';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Achievement routes - GET (no auth)
router.get('/badges', createServiceProxy(ACHIEVEMENT_SERVICE));
router.get('/api/badges', createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/badges': '/badges' }));
router.get('/achievements', createServiceProxy(ACHIEVEMENT_SERVICE));
router.get('/api/achievements', createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/achievements': '/achievements' }));
router.get('/leaderboard', createServiceProxy(ACHIEVEMENT_SERVICE));
router.get('/api/leaderboard', createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/leaderboard': '/leaderboard' }));

// Achievement routes - POST/PUT/DELETE (require auth)
router.use('/points', authMiddleware, createServiceProxy(ACHIEVEMENT_SERVICE));
router.use('/api/points', authMiddleware, createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/points': '/points' }));

export default router;