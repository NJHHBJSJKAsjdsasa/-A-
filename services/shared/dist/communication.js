"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCommunicator = void 0;
const axios_1 = __importDefault(require("axios"));
// Service URLs
const serviceUrls = {
    user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    community: process.env.COMMUNITY_SERVICE_URL || 'http://localhost:3002',
    message: process.env.MESSAGE_SERVICE_URL || 'http://localhost:3003',
    achievement: process.env.ACHIEVEMENT_SERVICE_URL || 'http://localhost:3004',
    learning: process.env.LEARNING_SERVICE_URL || 'http://localhost:3005',
    file: process.env.FILE_SERVICE_URL || 'http://localhost:3006'
};
// Create axios instances for each service
const createServiceClient = (baseURL) => {
    return axios_1.default.create({
        baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
// Service clients
const clients = {
    user: createServiceClient(serviceUrls.user),
    community: createServiceClient(serviceUrls.community),
    message: createServiceClient(serviceUrls.message),
    achievement: createServiceClient(serviceUrls.achievement),
    learning: createServiceClient(serviceUrls.learning),
    file: createServiceClient(serviceUrls.file)
};
// Service communication class
class ServiceCommunicator {
    /**
     * Call user service API
     */
    static async userService(path, options) {
        const { method = 'GET', data, headers } = options || {};
        try {
            const response = await clients.user.request({
                url: path,
                method,
                data,
                headers
            });
            return response.data;
        }
        catch (error) {
            console.error('User service communication error:', error);
            throw error;
        }
    }
    /**
     * Call community service API
     */
    static async communityService(path, options) {
        const { method = 'GET', data, headers } = options || {};
        try {
            const response = await clients.community.request({
                url: path,
                method,
                data,
                headers
            });
            return response.data;
        }
        catch (error) {
            console.error('Community service communication error:', error);
            throw error;
        }
    }
    /**
     * Call message service API
     */
    static async messageService(path, options) {
        const { method = 'GET', data, headers } = options || {};
        try {
            const response = await clients.message.request({
                url: path,
                method,
                data,
                headers
            });
            return response.data;
        }
        catch (error) {
            console.error('Message service communication error:', error);
            throw error;
        }
    }
    /**
     * Call achievement service API
     */
    static async achievementService(path, options) {
        const { method = 'GET', data, headers } = options || {};
        try {
            const response = await clients.achievement.request({
                url: path,
                method,
                data,
                headers
            });
            return response.data;
        }
        catch (error) {
            console.error('Achievement service communication error:', error);
            throw error;
        }
    }
    /**
     * Call learning service API
     */
    static async learningService(path, options) {
        const { method = 'GET', data, headers } = options || {};
        try {
            const response = await clients.learning.request({
                url: path,
                method,
                data,
                headers
            });
            return response.data;
        }
        catch (error) {
            console.error('Learning service communication error:', error);
            throw error;
        }
    }
    /**
     * Call file service API
     */
    static async fileService(path, options) {
        const { method = 'GET', data, headers } = options || {};
        try {
            const response = await clients.file.request({
                url: path,
                method,
                data,
                headers
            });
            return response.data;
        }
        catch (error) {
            console.error('File service communication error:', error);
            throw error;
        }
    }
}
exports.ServiceCommunicator = ServiceCommunicator;
exports.default = ServiceCommunicator;
//# sourceMappingURL=communication.js.map