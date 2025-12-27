/**
 * Application Constants
 * Central location for all magic numbers and configuration values
 * @version 1.0.0
 */

// ============================================================================
// TIME CONSTANTS (in milliseconds)
// ============================================================================

export const TIME = {
    // Base units
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,

    // API Timeouts
    TIMEOUT: {
        DEFAULT: 30 * 1000,           // 30 seconds
        SEARCH: 60 * 1000,            // 1 minute for vacancy search
        WEEKEND_SEARCH: 10 * 60 * 1000, // 10 minutes for weekend search
    },

    // Cache TTLs
    CACHE: {
        API_RESPONSE: 5 * 60 * 1000,  // 5 minutes for API responses
        HOTEL_LIST: 24 * 60 * 60 * 1000, // 24 hours for hotel list
    },

    // Retry delays
    RETRY: {
        BASE_DELAY: 1000,             // 1 second base retry delay
        MULTIPLIER: 2,                // Exponential backoff multiplier
    },

    // UI delays
    UI: {
        NOTIFICATION_DURATION: 2000,  // 2 seconds for notifications
        DEBOUNCE: 300,                // 300ms debounce delay
        THROTTLE: 1000,               // 1 second throttle delay
    }
};

// ============================================================================
// API CONSTANTS
// ============================================================================

export const API = {
    // Base URLs (environment-specific, see environment.js)
    MAX_RETRIES: 3,
    MAX_CACHE_SIZE: 100,

    // HTTP Status codes we handle
    STATUS: {
        OK: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        TIMEOUT: 408,
        RATE_LIMIT: 429,
        SERVER_ERROR: 500,
    },

    // Content types
    CONTENT_TYPE: {
        JSON: 'application/json',
        FORM: 'application/x-www-form-urlencoded',
    }
};

// ============================================================================
// CACHE CONSTANTS
// ============================================================================

export const CACHE = {
    // Storage keys
    KEYS: {
        HOTEL_LIST: 'afpesp_hotels_cache',
        USER_PREFERENCES: 'afpesp_user_prefs',
        LOG_LEVEL: 'logLevel',
    },

    // Storage limits
    LIMITS: {
        MAX_ENTRIES: 100,
        MAX_SIZE_MB: 5,
    }
};

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI = {
    // Animation durations
    ANIMATION: {
        FAST: 150,
        NORMAL: 300,
        SLOW: 600,
    },

    // Breakpoints (pixels)
    BREAKPOINTS: {
        MOBILE: 576,
        TABLET: 768,
        DESKTOP: 992,
        WIDE: 1200,
    },

    // Z-index layers
    Z_INDEX: {
        DROPDOWN: 1000,
        MODAL: 1050,
        TOOLTIP: 1060,
        NOTIFICATION: 1070,
    }
};

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION = {
    // Guest count limits
    GUESTS: {
        MIN: 1,
        MAX: 10,
        DEFAULT: 2,
    },

    // Date range limits (in days)
    DATE_RANGE: {
        MIN_NIGHTS: 1,
        MAX_NIGHTS: 30,
        MAX_ADVANCE_BOOKING_DAYS: 365,
    },

    // Text field limits
    TEXT: {
        MIN_SEARCH_LENGTH: 2,
        MAX_HOTEL_NAME_LENGTH: 100,
    }
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
    ENABLE_CACHING: true,
    ENABLE_RETRY: true,
    ENABLE_ANALYTICS: false,
    ENABLE_DEBUG_MODE: false,
};

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
    // Booking rule violations
    BOOKING_RULE: {
        WEEKEND_ONLY: 'WEEKEND_ONLY',
        MIN_NIGHTS: 'MIN_NIGHTS',
        MAX_ADVANCE: 'MAX_ADVANCE',
        CLOSED_DATES: 'CLOSED_DATES',
    },

    // API errors
    API_ERROR: {
        NETWORK: 'NETWORK_ERROR',
        TIMEOUT: 'TIMEOUT_ERROR',
        INVALID_RESPONSE: 'INVALID_RESPONSE',
        RATE_LIMIT: 'RATE_LIMIT_EXCEEDED',
    },

    // Client errors
    CLIENT_ERROR: {
        INVALID_INPUT: 'INVALID_INPUT',
        MISSING_REQUIRED: 'MISSING_REQUIRED',
        CACHE_FULL: 'CACHE_FULL',
    }
};

// ============================================================================
// DATE FORMATS
// ============================================================================

export const DATE_FORMATS = {
    ISO_8601: 'YYYY-MM-DD',           // API format
    DISPLAY_SHORT: 'DD/MM/YYYY',      // Brazilian format
    DISPLAY_LONG: 'DD [de] MMMM [de] YYYY',
    TIME_24H: 'HH:mm',
    DATETIME: 'DD/MM/YYYY HH:mm',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert time constant to human readable string
 * @param {number} ms - Time in milliseconds
 * @returns {string} Human readable time
 */
export function formatDuration(ms) {
    if (ms < TIME.SECOND) return `${ms}ms`;
    if (ms < TIME.MINUTE) return `${Math.round(ms / TIME.SECOND)}s`;
    if (ms < TIME.HOUR) return `${Math.round(ms / TIME.MINUTE)}min`;
    if (ms < TIME.DAY) return `${Math.round(ms / TIME.HOUR)}h`;
    return `${Math.round(ms / TIME.DAY)}d`;
}

/**
 * Validate if a value is within min/max range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if valid
 */
export function inRange(value, min, max) {
    return value >= min && value <= max;
}

/**
 * Get timeout value based on operation type
 * @param {string} type - Operation type ('default', 'search', 'weekendSearch')
 * @returns {number} Timeout in milliseconds
 */
export function getTimeout(type = 'default') {
    return TIME.TIMEOUT[type.toUpperCase()] || TIME.TIMEOUT.DEFAULT;
}

// ============================================================================
// UI CONSTANTS - CSS Classes
// ============================================================================

/**
 * CSS class names used throughout the application
 * Centralized to avoid magic strings and enable refactoring
 */
export const CSS_CLASSES = {
    // Hotel search results
    HOTEL_CARD: 'hotel-card',
    HOTEL_HEADER: 'hotel-header',
    VACANCIES_LIST: 'vacancies-list',
    VACANCY_ITEM: 'vacancy-item',
    
    // Holiday packages
    HOLIDAY_PACKAGE_BANNER: 'holiday-package-banner',
    
    // Links and actions
    FLEX_RESERVA_LINK: 'flex-reserva-link',
    
    // States
    EMPTY_STATE: 'empty-state',
    ERROR_STATE: 'error-state',
    
    // Filter states
    FILTER_ENABLED: 'filter-enabled',
    FILTER_DISABLED: 'filter-disabled',
    
    // Visibility
    VISIBLE: 'visible',
    HIDDEN: 'hidden',
    
    // Search lifecycle states
    STATE_INITIAL: 'state-initial',
    STATE_SEARCHING: 'state-searching',
    STATE_RESULTS: 'state-results'
};
