// Environment configuration for different deployment stages
// This file handles environment-specific settings

/**
 * Browser-compatible environment variables with defaults
 * Note: In browsers we don't have access to process.env, so we use defaults
 */
const ENV_VARS = {
    // Application environment - detect based on hostname
    // Override for testing: check URL parameter useProductionAPI
    NODE_ENV: (new URLSearchParams(window.location.search).get('useProductionAPI') === 'true') 
        ? 'production'
        : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'development' 
            : 'production'),
    
    // Application port
    PORT: 3000,
    
    // API endpoints - dynamically set based on environment
    // Development: Use mock API on localhost:3001
    // Production: Use live API
    API_BASE_URL: (new URLSearchParams(window.location.search).get('useProductionAPI') === 'true')
        ? 'https://www.mpbarbosa.com/api'
        : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3001/api'
            : 'https://www.mpbarbosa.com/api'),
    
    // AFPESP website configuration
    AFPESP_BASE_URL: 'https://www.afpesp.org.br',
    AFPESP_SEARCH_ENDPOINT: '/turismo/disponibilidade',
    
    // Search configuration
    DEFAULT_WEEKENDS: 8,
    MAX_WEEKENDS: 12,
    
    // Rate limiting
    RATE_LIMIT_WINDOW: 900000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 10,
    
    // Caching
    CACHE_TTL: 300000, // 5 minutes
    
    // Logging
    LOG_LEVEL: 'info',
    
    // Security
    CORS_ORIGIN: 'http://localhost:5173',
    
    // Database (if needed for future features)
    DATABASE_URL: '',
    
    // Email service (for notifications)
    EMAIL_SERVICE_API_KEY: '',
    EMAIL_FROM: 'noreply@sindicatos-monitor.com',
    
    // Analytics
    ANALYTICS_ID: '',
    
    // Error tracking
    SENTRY_DSN: ''
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