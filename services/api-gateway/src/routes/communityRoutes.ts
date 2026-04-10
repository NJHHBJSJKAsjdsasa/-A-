import express from 'express';
import { createServiceProxy } from '../utils/proxy';
import { COMMUNITY_SERVICE } from '../config';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Community routes - GET requests (no auth required)
router.get('/posts', createServiceProxy(COMMUNITY_SERVICE));
router.get('/api/posts', createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
router.get('/posts/:id', createServiceProxy(COMMUNITY_SERVICE));
router.get('/api/posts/:id', createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
router.get('/comments', createServiceProxy(COMMUNITY_SERVICE));
router.get('/api/comments', createServiceProxy(COMMUNITY_SERVICE, { '^/api/comments': '/comments' }));
router.get('/circles', createServiceProxy(COMMUNITY_SERVICE));
router.get('/api/circles', createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));
router.get('/circles/:id', createServiceProxy(COMMUNITY_SERVICE));
router.get('/api/circles/:id', createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));

// Community routes - GET comments (no auth required)
router.get('/posts/:id/comments', createServiceProxy(COMMUNITY_SERVICE));
router.get('/api/posts/:id/comments', createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));

// Community routes - POST/PUT/DELETE (require auth)
router.post('/posts', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
router.post('/api/posts', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
router.put('/posts/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
router.put('/api/posts/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
router.delete('/posts/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
router.delete('/api/posts/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
router.post('/posts/:id/like', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
router.post('/api/posts/:id/like', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
router.post('/posts/:id/comments', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
router.post('/api/posts/:id/comments', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
router.delete('/comments/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
router.delete('/api/comments/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/comments': '/comments' }));
router.post('/circles', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
router.post('/api/circles', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));
router.put('/circles/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
router.put('/api/circles/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));
router.delete('/circles/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
router.delete('/api/circles/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));
router.post('/circles/:id/join', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
router.post('/api/circles/:id/join', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));

export default router;