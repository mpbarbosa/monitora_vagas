/**
 * Mock for ibira-loader.js in test environment
 * Provides a mock IbiraAPIFetchManager for testing
 */

// Mock IbiraAPIFetchManager class
export class IbiraAPIFetchManager {
    constructor(config) {
        this.config = config;
        this.baseUrl = config.baseUrl || 'http://localhost:3001/api';
        this.timeout = config.timeout || 30000;
    }

    async fetch(url, options = {}) {
        // Mock fetch implementation
        return {
            ok: true,
            status: 200,
            json: async () => ({ success: true, data: [] }),
            text: async () => 'mock response'
        };
    }

    getCacheStats() {
        return {
            exists: false,
            expired: false,
            count: 0,
            age: 0,
            remaining: 0
        };
    }
}

// Export the mock loader function
export async function loadIbira() {
    return { IbiraAPIFetchManager };
}

// Export default
export default { IbiraAPIFetchManager, loadIbira };
