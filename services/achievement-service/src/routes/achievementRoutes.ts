import { Router } from 'express';
import { body } from 'express-validator';
import {
  getBadges,
  getUserBadges,
  unlockBadge,
  getUserLevel,
  addExp,
  getLeaderboard,
  getPoints,
  usePoints,
  earnPoints
} from '../controllers/achievementController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/badges', getBadges);
router.get('/users/:userId/badges', getUserBadges);
router.post(
  '/users/badges',
  authenticate,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('badgeId').notEmpty().withMessage('Badge ID is required')
  ],
  unlockBadge
);

router.get('/users/:userId/level', getUserLevel);
router.post(
  '/users/exp',
  authenticate,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('amount').isInt({ min: 1 }).withMessage('Amount must be positive'),
    body('reason').notEmpty().withMessage('Reason is required')
  ],
  addExp
);

router.get('/leaderboard/:type/:period', getLeaderboard);

router.get('/points', authenticate, getPoints);
router.post(
  '/points/use',
  authenticate,
  [
    body('amount').isInt({ min: 1 }).withMessage('Amount must be positive'),
    body('reason').notEmpty().withMessage('Reason is required')
  ],
  usePoints
);
router.post(
  '/points/earn',
  authenticate,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('amount').isInt({ min: 1 }).withMessage('Amount must be positive'),
    body('reason').notEmpty().withMessage('Reason is required')
  ],
  earnPoints
);

export default router;
