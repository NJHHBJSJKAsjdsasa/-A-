import express from 'express';
import { createServiceProxy } from '../utils/proxy';
import { USER_SERVICE } from '../config';

const router = express.Router();

// Auth routes - no auth required
router.use('/auth', createServiceProxy(USER_SERVICE, { '^/auth': '' }));
router.use('/api/auth', createServiceProxy(USER_SERVICE, { '^/api/auth': '' }));

export default router;