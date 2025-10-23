// Environment configuration for different deployment stages
// This file handles environment-specific settings

/**
 * Environment variables with defaults
 */
const ENV_VARS = {
    // Application environment
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Application port
    PORT: process.env.PORT || 3000,
    
    // API endpoints
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
    
    // AFPESP website configuration
    AFPESP_BASE_URL: process.env.AFPESP_BASE_URL || 'https://www.afpesp.org.br',
    AFPESP_SEARCH_ENDPOINT: process.env.AFPESP_SEARCH_ENDPOINT || '/turismo/disponibilidade',
    
    // Search configuration
    DEFAULT_WEEKENDS: parseInt(process.env.DEFAULT_WEEKENDS) || 8,
    MAX_WEEKENDS: parseInt(process.env.MAX_WEEKENDS) || 12,
    
    // Rate limiting
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
    
    // Caching
    CACHE_TTL: parseInt(process.env.CACHE_TTL) || 300000, // 5 minutes
    
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    
    // Security
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    
    // Database (if needed for future features)
    DATABASE_URL: process.env.DATABASE_URL || '',
    
    // Email service (for notifications)
    EMAIL_SERVICE_API_KEY: process.env.EMAIL_SERVICE_API_KEY || '',
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@afpesp-monitor.com',
    
    // Analytics
    ANALYTICS_ID: process.env.ANALYTICS_ID || '',
    
    // Error tracking
    SENTRY_DSN: process.env.SENTRY_DSN || ''
};

/**
 * Validate required environment variables
 * @param {Array} requiredVars - Array of required variable names
 * @throws {Error} If required variables are missing
 */
export function validateEnvironment(requiredVars = []) {
    const missing = requiredVars.filter(varName => !ENV_VARS[varName]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

/**
 * Get environment configuration
 * @returns {Object} Environment configuration object
 */
export function getEnvironment() {
    return {
        ...ENV_VARS,
        
        // Computed properties
        isDevelopment: ENV_VARS.NODE_ENV === 'development',
        isProduction: ENV_VARS.NODE_ENV === 'production',
        isTest: ENV_VARS.NODE_ENV === 'test',
        
        // Application URLs
        fullApiUrl: ENV_VARS.API_BASE_URL,
        afpespSearchUrl: `${ENV_VARS.AFPESP_BASE_URL}${ENV_VARS.AFPESP_SEARCH_ENDPOINT}`,
        
        // Feature flags based on environment
        features: {
            enableLogging: ENV_VARS.NODE_ENV !== 'test',
            enableAnalytics: ENV_VARS.NODE_ENV === 'production' && ENV_VARS.ANALYTICS_ID,
            enableErrorTracking: ENV_VARS.NODE_ENV === 'production' && ENV_VARS.SENTRY_DSN,
            enableEmailNotifications: !!ENV_VARS.EMAIL_SERVICE_API_KEY
        }
    };
}

/**
 * Environment-specific configurations
 */
export const ENVIRONMENT_CONFIGS = {
    development: {
        logging: {
            level: 'debug',
            enableConsole: true,
            enableFile: false
        },
        security: {
            strictCors: false,
            enableHttps: false
        },
        performance: {
            enableCaching: false,
            enableMinification: false
        }
    },
    
    production: {
        logging: {
            level: 'error',
            enableConsole: false,
            enableFile: true
        },
        security: {
            strictCors: true,
            enableHttps: true
        },
        performance: {
            enableCaching: true,
            enableMinification: true
        }
    },
    
    test: {
        logging: {
            level: 'silent',
            enableConsole: false,
            enableFile: false
        },
        security: {
            strictCors: false,
            enableHttps: false
        },
        performance: {
            enableCaching: false,
            enableMinification: false
        }
    }
};

/**
 * Get current environment configuration
 * @returns {Object} Current environment configuration
 */
export function getCurrentEnvironmentConfig() {
    const env = getEnvironment();
    return ENVIRONMENT_CONFIGS[env.NODE_ENV] || ENVIRONMENT_CONFIGS.development;
}