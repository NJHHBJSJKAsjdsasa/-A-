import express from 'express';
import proxy from 'express-http-proxy';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 8888;

const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const COMMUNITY_SERVICE = process.env.COMMUNITY_SERVICE_URL || 'http://localhost:3002';
const MESSAGE_SERVICE = process.env.MESSAGE_SERVICE_URL || 'http://localhost:3003';
const ACHIEVEMENT_SERVICE = process.env.ACHIEVEMENT_SERVICE_URL || 'http://localhost:3004';
const LEARNING_SERVICE = process.env.LEARNING_SERVICE_URL || 'http://localhost:3005';
const FILE_SERVICE = process.env.FILE_SERVICE_URL || 'http://localhost:3006';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
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
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as express.Request & { user: unknown }).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
    });
  }
};

const serviceProxy = (target: string) => proxy(target, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\/api/, '');
  },
  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    // Pass body content as-is
    return bodyContent;
  },
  proxyErrorHandler: (err, res, next) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      success: false,
      error: { code: 'SERVICE_UNAVAILABLE', message: 'Service temporarily unavailable' }
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'api-gateway', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth routes - both /auth and /api/auth
app.use('/auth', express.json(), serviceProxy(USER_SERVICE));
app.use('/api/auth', express.json(), serviceProxy(USER_SERVICE));

// User routes
app.use('/users', express.json(), authMiddleware, serviceProxy(USER_SERVICE));
app.use('/api/users', express.json(), authMiddleware, serviceProxy(USER_SERVICE));

// Community routes
app.use('/posts', express.json(), serviceProxy(COMMUNITY_SERVICE));
app.use('/api/posts', express.json(), serviceProxy(COMMUNITY_SERVICE));
app.use('/comments', express.json(), serviceProxy(COMMUNITY_SERVICE));
app.use('/api/comments', express.json(), serviceProxy(COMMUNITY_SERVICE));
app.use('/circles', express.json(), serviceProxy(COMMUNITY_SERVICE));
app.use('/api/circles', express.json(), serviceProxy(COMMUNITY_SERVICE));

// Message routes
app.use('/messages', express.json(), authMiddleware, serviceProxy(MESSAGE_SERVICE));
app.use('/api/messages', express.json(), authMiddleware, serviceProxy(MESSAGE_SERVICE));
app.use('/conversations', express.json(), authMiddleware, serviceProxy(MESSAGE_SERVICE));
app.use('/api/conversations', express.json(), authMiddleware, serviceProxy(MESSAGE_SERVICE));

// Achievement routes
app.use('/badges', express.json(), serviceProxy(ACHIEVEMENT_SERVICE));
app.use('/api/badges', express.json(), serviceProxy(ACHIEVEMENT_SERVICE));
app.use('/achievements', express.json(), serviceProxy(ACHIEVEMENT_SERVICE));
app.use('/api/achievements', express.json(), serviceProxy(ACHIEVEMENT_SERVICE));
app.use('/leaderboard', express.json(), serviceProxy(ACHIEVEMENT_SERVICE));
app.use('/api/leaderboard', express.json(), serviceProxy(ACHIEVEMENT_SERVICE));
app.use('/points', express.json(), authMiddleware, serviceProxy(ACHIEVEMENT_SERVICE));
app.use('/api/points', express.json(), authMiddleware, serviceProxy(ACHIEVEMENT_SERVICE));

// Learning routes
app.use('/courses', express.json(), serviceProxy(LEARNING_SERVICE));
app.use('/api/courses', express.json(), serviceProxy(LEARNING_SERVICE));
app.use('/lessons', express.json(), serviceProxy(LEARNING_SERVICE));
app.use('/api/lessons', express.json(), serviceProxy(LEARNING_SERVICE));
app.use('/learning', express.json(), serviceProxy(LEARNING_SERVICE));
app.use('/api/learning', express.json(), serviceProxy(LEARNING_SERVICE));

// File routes
app.use('/files', express.json(), authMiddleware, serviceProxy(FILE_SERVICE));
app.use('/api/files', express.json(), authMiddleware, serviceProxy(FILE_SERVICE));

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
