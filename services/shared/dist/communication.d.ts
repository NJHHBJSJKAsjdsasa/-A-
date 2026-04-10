export declare class ServiceCommunicator {
    /**
     * Call user service API
     */
    static userService(path: string, options?: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: any;
        headers?: Record<string, string>;
    }): Promise<any>;
    /**
     * Call community service API
     */
    static communityService(path: string, options?: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: any;
        headers?: Record<string, string>;
    }): Promise<any>;
    /**
     * Call message service API
     */
    static messageService(path: string, options?: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: any;
        headers?: Record<string, string>;
    }): Promise<any>;
    /**
     * Call achievement service API
     */
    static achievementService(path: string, options?: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: any;
        headers?: Record<string, string>;
    }): Promise<any>;
    /**
     * Call learning service API
     */
    static learningService(path: string, options?: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: any;
        headers?: Record<string, string>;
    }): Promise<any>;
    /**
     * Call file service API
     */
    static fileService(path: string, options?: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        data?: any;
        headers?: Record<string, string>;
    }): Promise<any>;
}
export default ServiceCommunicator;
//# sourceMappingURL=communication.d.ts.map