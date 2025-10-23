// Configuration files for the Trade Union Hotel Search Platform
// Environment-specific and build configurations

/**
 * Application configuration constants
 */
export const APP_CONFIG = {
    // Application metadata
    name: 'Busca de Vagas em Hotéis Sindicais',
    version: '2.0.0',
    description: 'Modern web application for searching trade union hotel partnerships',
    
    // Search configuration
    search: {
        // Default number of weekends to search
        defaultWeekends: 8,
        // Maximum number of weekends allowed
        maxWeekends: 12,
        // Minimum number of weekends allowed
        minWeekends: 1,
        // Default search type
        defaultSearchType: 'weekend',
        // Available search types
        searchTypes: ['weekend', 'specific-dates']
    },
    
    // Hotel configuration
    hotels: [
        {
            value: 'litoral',
            label: 'Litoral',
            description: 'Hotéis sindicais em destinos de praia'
        },
        {
            value: 'serra',
            label: 'Serra',
            description: 'Hotéis sindicais em destinos de montanha'
        },
        {
            value: 'interior',
            label: 'Interior',
            description: 'Hotéis sindicais em cidades do interior'
        },
        {
            value: 'capital',
            label: 'Capital',
            description: 'Hotéis sindicais em grandes centros urbanos'
        }
    ],
    
    // UI configuration
    ui: {
        // Animation durations (in milliseconds)
        animations: {
            progressBar: 300,
            fadeIn: 200,
            slideIn: 250
        },
        
        // Breakpoints for responsive design
        breakpoints: {
            mobile: '768px',
            tablet: '1024px',
            desktop: '1200px'
        },
        
        // Theme colors
        colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#17a2b8'
        }
    },
    
    // API configuration
    api: {
        // Base URL for API endpoints (to be configured per environment)
        baseUrl: '/api',
        // Request timeout (in milliseconds)
        timeout: 30000,
        // Maximum retry attempts
        maxRetries: 3
    }
};

/**
 * Development environment configuration
 */
export const DEV_CONFIG = {
    ...APP_CONFIG,
    
    // Development-specific overrides
    api: {
        ...APP_CONFIG.api,
        baseUrl: 'http://localhost:3000/api',
        timeout: 60000, // Longer timeout for development
        debug: true
    },
    
    // Development logging
    logging: {
        level: 'debug',
        enableConsole: true,
        enableNetwork: true
    }
};

/**
 * Production environment configuration
 */
export const PROD_CONFIG = {
    ...APP_CONFIG,
    
    // Production-specific overrides
    api: {
        ...APP_CONFIG.api,
        baseUrl: '/api', // Relative to deployment domain
        timeout: 30000,
        debug: false
    },
    
    // Production logging
    logging: {
        level: 'error',
        enableConsole: false,
        enableNetwork: false
    }
};

/**
 * Get configuration based on current environment
 * @returns {Object} Environment-specific configuration
 */
export function getConfig() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    return isDevelopment ? DEV_CONFIG : PROD_CONFIG;
}

/**
 * Feature flags for conditional functionality
 */
export const FEATURE_FLAGS = {
    // Enable advanced search filters
    advancedSearch: true,
    
    // Enable search history
    searchHistory: true,
    
    // Enable email notifications
    emailNotifications: false,
    
    // Enable dark mode toggle
    darkMode: true,
    
    // Enable analytics tracking
    analytics: false
};

/**
 * Routes configuration for the application
 */
export const ROUTES = {
    home: '/',
    search: '/search',
    results: '/results',
    history: '/history',
    about: '/about'
};