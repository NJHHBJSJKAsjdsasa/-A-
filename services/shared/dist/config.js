"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.warn(`Warning: Required environment variable ${envVar} is not set. Using default value.`);
    }
}
exports.config = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your-jwt-secret-key',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        expiresIn: '2h',
        refreshExpiresIn: '7d'
    },
    bcrypt: {
        saltRounds: 12
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    }
};
//# sourceMappingURL=config.js.map