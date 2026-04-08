import { Router } from 'express';
import { body } from 'express-validator';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getComments,
  createComment,
  deleteComment,
  getCircles,
  getCircle,
  createCircle,
  joinCircle,
  updateCircle,
  deleteCircle
} from '../controllers/communityController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/posts', optionalAuth, getPosts);
router.get('/posts/:id', getPost);
router.post(
  '/posts',
  authenticate,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
  ],
  createPost
);
router.put('/posts/:id', authenticate, updatePost);
router.delete('/posts/:id', authenticate, deletePost);
router.post('/posts/:id/like', authenticate, likePost);

router.get('/posts/:postId/comments', getComments);
router.post(
  '/posts/:postId/comments',
  authenticate,
  [body('content').notEmpty().withMessage('Content is required')],
  createComment
);
router.delete('/comments/:id', authenticate, deleteComment);

router.get('/circles', getCircles);
router.get('/circles/:id', getCircle);
router.post(
  '/circles',
  authenticate,
  [body('name').notEmpty().withMessage('Name is required')],
  createCircle
);
router.post('/circles/:id/join', authenticate, joinCircle);
router.put('/circles/:id', authenticate, updateCircle);
router.delete('/circles/:id', authenticate, deleteCircle);

export default router;
