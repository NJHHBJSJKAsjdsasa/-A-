import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import communityRoutes from './communityRoutes';
import messageRoutes from './messageRoutes';
import achievementRoutes from './achievementRoutes';
import learningRoutes from './learningRoutes';
import fileRoutes from './fileRoutes';

const router = express.Router();

// Register all routes
router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/', communityRoutes);
router.use('/', messageRoutes);
router.use('/', achievementRoutes);
router.use('/', learningRoutes);
router.use('/', fileRoutes);

export default router;