/**
 * Centralized Logger Service
 * Provides environment-aware logging with configurable log levels
 * @version 1.0.0
 */

import { CACHE } from '../config/constants.js';

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
};

class Logger {
    constructor() {
        this.level = this.getLogLevel();
        this.isProduction = this.detectEnvironment();
    }

    /**
     * Detect environment (production vs development)
     */
    detectEnvironment() {
        // Check if running in production
        return window.location.hostname === 'sesi.pessoal.online' ||
               window.location.hostname === 'www.sesi.pessoal.online' ||
               process.env.NODE_ENV === 'production';
    }

    /**
     * Get current log level from environment
     */
    getLogLevel() {
        // Production: only errors
        if (this.detectEnvironment()) {
            return LOG_LEVELS.ERROR;
        }

        // Development: check localStorage override or default to DEBUG
        const savedLevel = localStorage.getItem(CACHE.KEYS.LOG_LEVEL);
        if (savedLevel && LOG_LEVELS[savedLevel] !== undefined) {
            return LOG_LEVELS[savedLevel];
        }

        return LOG_LEVELS.DEBUG;
    }

    /**
     * Set log level (persisted in localStorage for development)
     */
    setLogLevel(level) {
        if (LOG_LEVELS[level] !== undefined) {
            this.level = LOG_LEVELS[level];
            if (!this.isProduction) {
                localStorage.setItem(CACHE.KEYS.LOG_LEVEL, level);
            }
        }
    }

    /**
     * Format log message with timestamp and context
     */
    formatMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` [${context}]` : '';
        return `[${timestamp}]${contextStr} ${level}: ${message}`;
    }

    /**
     * Log debug message (development only)
     */
    debug(message, context = null) {
        if (this.level <= LOG_LEVELS.DEBUG) {
            console.log(this.formatMessage('DEBUG', message, context));
        }
    }

    /**
     * Log info message
     */
    info(message, context = null) {
        if (this.level <= LOG_LEVELS.INFO) {
            console.info(this.formatMessage('INFO', message, context));
        }
    }

    /**
     * Log warning message
     */
    warn(message, context = null) {
        if (this.level <= LOG_LEVELS.WARN) {
            console.warn(this.formatMessage('WARN', message, context));
        }
    }

    /**
     * Log error message (always logged)
     */
    error(message, error = null, context = null) {
        if (this.level <= LOG_LEVELS.ERROR) {
            const errorMsg = error ? `${message} - ${error.message || error}` : message;
            console.error(this.formatMessage('ERROR', errorMsg, context));
            
            // In production, could send to error tracking service
            if (this.isProduction && error) {
                this.reportError(errorMsg, error);
            }
        }
    }

    /**
     * Report error to tracking service (placeholder for future integration)
     */
    reportError(message, error) {
        // Future: integrate with Sentry, Rollbar, etc.
        // For now, just ensure it's in console
        console.error('[Error Tracking]', { message, error });
    }

    /**
     * Group related log messages
     */
    group(label, collapsed = false) {
        if (this.level <= LOG_LEVELS.DEBUG && !this.isProduction) {
            if (collapsed) {
                console.groupCollapsed(label);
            } else {
                console.group(label);
            }
        }
    }

    /**
     * End log group
     */
    groupEnd() {
        if (this.level <= LOG_LEVELS.DEBUG && !this.isProduction) {
            console.groupEnd();
        }
    }

    /**
     * Log with emoji prefix for better visibility (development only)
     */
    emoji(emoji, message, context = null) {
        if (this.level <= LOG_LEVELS.DEBUG) {
            console.log(`${emoji} ${message}${context ? ` [${context}]` : ''}`);
        }
    }

    /**
     * Performance timing
     */
    time(label) {
        if (this.level <= LOG_LEVELS.DEBUG && !this.isProduction) {
            console.time(label);
        }
    }

    /**
     * End performance timing
     */
    timeEnd(label) {
        if (this.level <= LOG_LEVELS.DEBUG && !this.isProduction) {
            console.timeEnd(label);
        }
    }

    /**
     * Get current environment info
     */
    getEnvironmentInfo() {
        return {
            isProduction: this.isProduction,
            logLevel: Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === this.level),
            hostname: window.location.hostname
        };
    }
}

// Create singleton instance
const logger = new Logger();

// Expose setLogLevel globally for development debugging
if (!logger.isProduction) {
    window.setLogLevel = (level) => {
        logger.setLogLevel(level);
        console.log(`Log level set to: ${level}`);
    };
}

export { logger, LOG_LEVELS };
