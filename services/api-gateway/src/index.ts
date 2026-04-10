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

// Auth routes
app.use('/auth', createServiceProxy(USER_SERVICE, { '^/auth': '' }));
app.use('/api/auth', createServiceProxy(USER_SERVICE, { '^/api/auth': '' }));

// User routes
app.use('/users', authMiddleware, createServiceProxy(USER_SERVICE));
app.use('/api/users', authMiddleware, createServiceProxy(USER_SERVICE, { '^/api/users': '/users' }));

// Community routes - GET routes (no auth required)
app.use('/posts', createServiceProxy(COMMUNITY_SERVICE));
app.use('/api/posts', createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));
app.use('/comments', createServiceProxy(COMMUNITY_SERVICE));
app.use('/api/comments', createServiceProxy(COMMUNITY_SERVICE, { '^/api/comments': '/comments' }));
app.use('/circles', createServiceProxy(COMMUNITY_SERVICE));
app.use('/api/circles', createServiceProxy(COMMUNITY_SERVICE, { '^/api/circles': '/circles' }));

// Protected community routes
app.use('/posts', authMiddleware, createServiceProxy(COMMUNITY_SERVICE));
app.use('/api/posts', authMiddleware, createServiceProxy(COMMUNITY_SERVICE, { '^/api/posts': '/posts' }));

// Message routes
app.use('/messages', authMiddleware, createServiceProxy(MESSAGE_SERVICE));
app.use('/api/messages', authMiddleware, createServiceProxy(MESSAGE_SERVICE, { '^/api/messages': '/messages' }));
app.use('/conversations', authMiddleware, createServiceProxy(MESSAGE_SERVICE));
app.use('/api/conversations', authMiddleware, createServiceProxy(MESSAGE_SERVICE, { '^/api/conversations': '/conversations' }));

// Achievement routes
app.use('/badges', createServiceProxy(ACHIEVEMENT_SERVICE));
app.use('/api/badges', createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/badges': '/badges' }));
app.use('/achievements', createServiceProxy(ACHIEVEMENT_SERVICE));
app.use('/api/achievements', createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/achievements': '/achievements' }));
app.use('/leaderboard', createServiceProxy(ACHIEVEMENT_SERVICE));
app.use('/api/leaderboard', createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/leaderboard': '/leaderboard' }));
app.use('/points', authMiddleware, createServiceProxy(ACHIEVEMENT_SERVICE));
app.use('/api/points', authMiddleware, createServiceProxy(ACHIEVEMENT_SERVICE, { '^/api/points': '/points' }));

// Learning routes
app.use('/courses', createServiceProxy(LEARNING_SERVICE));
app.use('/api/courses', createServiceProxy(LEARNING_SERVICE, { '^/api/courses': '/courses' }));
app.use('/lessons', createServiceProxy(LEARNING_SERVICE));
app.use('/api/lessons', createServiceProxy(LEARNING_SERVICE, { '^/api/lessons': '/lessons' }));
app.use('/learning', authMiddleware, createServiceProxy(LEARNING_SERVICE));
app.use('/api/learning', authMiddleware, createServiceProxy(LEARNING_SERVICE, { '^/api/learning': '/learning' }));

// File routes
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
