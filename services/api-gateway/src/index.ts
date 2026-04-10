import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { config } from '@doraemon/shared';

const app = express();
const PORT = process.env.PORT || 8080;

const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const COMMUNITY_SERVICE = process.env.COMMUNITY_SERVICE_URL || 'http://localhost:3002';
const MESSAGE_SERVICE = process.env.MESSAGE_SERVICE_URL || 'http://localhost:3003';
const ACHIEVEMENT_SERVICE = process.env.ACHIEVEMENT_SERVICE_URL || 'http://localhost:3004';
const LEARNING_SERVICE = process.env.LEARNING_SERVICE_URL || 'http://localhost:3005';
const FILE_SERVICE = process.env.FILE_SERVICE_URL || 'http://localhost:3006';

const corsOptions = {
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const publicPaths = ['/auth/register', '/auth/login', '/auth/oauth', '/health', '/api/auth/register', '/api/auth/login', '/api/auth/oauth'];
  const path = req.path;
  
  if (publicPaths.some(p => path.startsWith(p))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No token provided' }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    (req as express.Request & { user: unknown }).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
    });
  }
};

// Create proxy middleware
const createServiceProxy = (target: string, pathRewrite: Record<string, string> = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      (res as express.Response).status(500).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Service temporarily unavailable' }
      });
    }
  });
};

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'api-gateway', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth routes - no auth required
app.use('/auth', createServiceProxy(USER_SERVICE, { '^/auth': '' }));
app.use('/api/auth', createServiceProxy(USER_SERVICE, { '^/api/auth': '' }));

// User routes - require auth
app.use('/users', authMiddleware, createServiceProxy(USER_SERVICE));
app.use('/api/users', authMiddleware, createServiceProxy(USER_SERVICE, { '^/api/users': '/users' }));

// Community routes - GET requests (no auth required)
app.get('/posts', createServiceProxy(COMMUNITY_SERVICE));
app.get('/api/posts', createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
app.get('/posts/:id', createServiceProxy(COMMUNITY_SERVICE));
app.get('/api/posts/:id', createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
app.get('/comments', createServiceProxy(COMMUNITY_SERVICE));
app.get('/api/comments', createServiceProxy(COMMUNITY_SERVICE, { '^/api/comments': '/comments' }));
app.get('/circles', createServiceProxy(COMMUNITY_SERVICE));
app.get('/api/circles', createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));
app.get('/circles/:id', createServiceProxy(COMMUNITY_SERVICE));
app.get('/api/circles/:id', createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));

// Community routes - GET comments (no auth required)
app.get('/posts/:id/comments', createServiceProxy(COMMUNITY_SERVICE));
app.get('/api/posts/:id/comments', createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));

// Community routes - POST/PUT/DELETE (require auth)
app.post('/posts', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.post('/api/posts', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
app.put('/posts/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.put('/api/posts/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
app.delete('/posts/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.delete('/api/posts/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
app.post('/posts/:id/like', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.post('/api/posts/:id/like', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
app.post('/posts/:id/comments', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.post('/api/posts/:id/comments', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
app.delete('/comments/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.delete('/api/comments/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/comments': '/comments' }));
app.post('/circles', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.post('/api/circles', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));
app.put('/circles/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.put('/api/circles/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));
app.delete('/circles/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.delete('/api/circles/:id', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));
app.post('/circles/:id/join', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.post('/api/circles/:id/join', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));

// Message routes - require auth
app.use('/messages', authMiddleware, createServiceProxy(MESSAGE_SERVICE));
app.use('/api/messages', authMiddleware, createServiceProxy(MESSAGE_SERVICE, { '^/api/messages': '/messages' }));
app.use('/conversations', authMiddleware, createServiceProxy(MESSAGE_SERVICE));
app.use('/api/conversations', authMiddleware, createServiceProxy(MESSAGE_SERVICE, { '^/api/conversations': '/conversations' }));

// Achievement routes - GET (no auth)
app.get('/badges', createServiceProxy(ACHIEVEMENT_SERVICE));
app.get('/api/badges', createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/badges': '/badges' }));
app.get('/achievements', createServiceProxy(ACHIEVEMENT_SERVICE));
app.get('/api/achievements', createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/achievements': '/achievements' }));
app.get('/leaderboard', createServiceProxy(ACHIEVEMENT_SERVICE));
app.get('/api/leaderboard', createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/leaderboard': '/leaderboard' }));

// Achievement routes - POST/PUT/DELETE (require auth)
app.use('/points', authMiddleware, createServiceProxy(ACHIEVEMENT_SERVICE));
app.use('/api/points', authMiddleware, createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/points': '/points' }));

// Learning routes - GET (no auth)
app.get('/courses', createServiceProxy(LEARNING_SERVICE));
app.get('/api/courses', createServiceProxy(LEARNING_SERVICE, { '^/api/courses': '/courses' }));
app.get('/courses/:id', createServiceProxy(LEARNING_SERVICE));
app.get('/api/courses/:id', createServiceProxy(LEARNING_SERVICE, { '^/api/courses': '/courses' }));
app.get('/lessons/:id', createServiceProxy(LEARNING_SERVICE));
app.get('/api/lessons/:id', createServiceProxy(LEARNING_SERVICE, { '^/api/lessons': '/lessons' }));

// Learning routes - POST/PUT/DELETE (require auth)
app.use('/learning', authMiddleware, createServiceProxy(LEARNING_SERVICE));
app.use('/api/learning', authMiddleware, createServiceProxy(LEARNING_SERVICE, { '^/api/learning': '/learning' }));

// File routes - require auth
app.use('/files', authMiddleware, createServiceProxy(FILE_SERVICE));
app.use('/api/files', authMiddleware, createServiceProxy(FILE_SERVICE, { '^/api/files': '/files' }));

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Gateway error:', err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Gateway error' }
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

export default app;
