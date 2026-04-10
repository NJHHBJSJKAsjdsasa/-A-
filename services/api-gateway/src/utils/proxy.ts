import { createProxyMiddleware } from 'http-proxy-middleware';

/**
 * Create service proxy middleware
 */
export const createServiceProxy = (target: string, pathRewrite: Record<string, string> = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      (res as any).status(500).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Service temporarily unavailable' }
      });
    }
  });
};