import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@doraemon/shared';

/**
 * Authentication middleware
 */
export const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
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