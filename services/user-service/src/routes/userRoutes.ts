import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import {
  register,
  login,
  refreshToken,
  oauthLogin,
  sendPhoneVerification,
  verifyPhone,
  sendEmailVerification,
  verifyEmail,
  getUser,
  updateUser,
  changePassword,
  deleteAccount,
  getMe,
  updateUserPoints,
  uploadAvatar
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('nickname').notEmpty().withMessage('Nickname is required')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

router.post('/refresh-token', refreshToken);

router.get('/oauth/:provider', oauthLogin);
router.get('/oauth/:provider/callback', oauthLogin);

router.post('/verify/phone', sendPhoneVerification);
router.post('/verify/phone/confirm', authenticate, verifyPhone);

router.post('/verify/email', authenticate, sendEmailVerification);
router.post('/verify/email/confirm', authenticate, verifyEmail);

router.get('/me', authenticate, getMe);

router.get('/:id', getUser);

router.put(
  '/:id',
  authenticate,
  [
    body('nickname').optional().notEmpty().withMessage('Nickname cannot be empty'),
    body('language').optional().isIn(['zh', 'en', 'ja', 'ko']).withMessage('Invalid language')
  ],
  updateUser
);

router.put(
  '/:id/password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  changePassword
);

router.delete('/:id', authenticate, deleteAccount);

router.post('/:id/update-points', authenticate, updateUserPoints);

router.post('/:id/avatar', authenticate, upload.single('avatar'), uploadAvatar);

export default router;
