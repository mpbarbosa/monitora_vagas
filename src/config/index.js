// Central export point for all configuration modules
// Provides easy access to all configuration settings

// Import all configuration modules
export { APP_CONFIG, DEV_CONFIG, PROD_CONFIG, getConfig, FEATURE_FLAGS, ROUTES } from './app.js';
export { 
    getEnvironment, 
    validateEnvironment, 
    ENVIRONMENT_CONFIGS, 
    getCurrentEnvironmentConfig 
} from './environment.js';
export {
    HOTELS,
    SEARCH_TYPES,
    ROOM_TYPES,
    SEARCH_STATUS,
    DATE_CONSTANTS,
    API_ENDPOINTS,
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    UI_CONSTANTS,
    REGEX_PATTERNS
} from './constants.js';

/**
 * Combined configuration object for easy access
 * This provides a single point of access to all configuration
 */
export const CONFIG = {
    // Get the appropriate app configuration
    get app() {
        return getConfig();
    },
    
    // Get environment configuration
    get env() {
        return getEnvironment();
    },
    
    // Get current environment-specific config
    get envConfig() {
        return getCurrentEnvironmentConfig();
    },
    
    // Constants
    hotels: HOTELS,
    searchTypes: SEARCH_TYPES,
    roomTypes: ROOM_TYPES,
    searchStatus: SEARCH_STATUS,
    dates: DATE_CONSTANTS,
    api: API_ENDPOINTS,
    http: HTTP_STATUS,
    errors: ERROR_MESSAGES,
    success: SUCCESS_MESSAGES,
    ui: UI_CONSTANTS,
    regex: REGEX_PATTERNS
};

/**
 * Configuration validation utility
 * Validates that all required configuration is present
 */
export function validateConfiguration() {
    const requiredEnvVars = [];
    
    // Add required environment variables based on features
    const env = getEnvironment();
    
    if (env.features.enableEmailNotifications) {
        requiredEnvVars.push('EMAIL_SERVICE_API_KEY', 'EMAIL_FROM');
    }
    
    if (env.features.enableErrorTracking) {
        requiredEnvVars.push('SENTRY_DSN');
    }
    
    if (env.features.enableAnalytics) {
        requiredEnvVars.push('ANALYTICS_ID');
    }
    
    // Validate environment variables
    try {
        validateEnvironment(requiredEnvVars);
        return { valid: true, errors: [] };
    } catch (error) {
        return { valid: false, errors: [error.message] };
    }
}

/**
 * Get configuration summary for debugging
 * Returns a sanitized view of current configuration
 */
export function getConfigSummary() {
    const env = getEnvironment();
    
    return {
        environment: env.NODE_ENV,
        features: env.features,
        hotels: Object.keys(HOTELS).length,
        searchTypes: Object.keys(SEARCH_TYPES).length,
        roomTypes: Object.keys(ROOM_TYPES).length,
        apiEndpoints: Object.keys(API_ENDPOINTS).length,
        timestamp: new Date().toISOString()
    };
}