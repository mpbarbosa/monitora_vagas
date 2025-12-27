/**
 * Global JavaScript utilities
 * Minimal global initialization with centralized logging and error handling
 * @version 2.2.0
 */

import { logger } from '../services/logger.js';

/**
 * Global error boundary for unhandled errors
 * Catches runtime errors and logs them centrally
 * @param {ErrorEvent} event - Error event object
 */
function handleUncaughtError(event) {
    const { message, filename, lineno, colno, error } = event;
    
    logger.error('Uncaught error', error || new Error(message), 'ErrorBoundary');
    logger.debug(`Location: ${filename}:${lineno}:${colno}`, 'ErrorBoundary');
    
    // Show user-friendly error message
    showErrorNotification('An unexpected error occurred. Please refresh the page.');
    
    // Prevent default browser error handling
    event.preventDefault();
}

/**
 * Global error boundary for unhandled promise rejections
 * Catches async errors that weren't caught with .catch()
 * @param {PromiseRejectionEvent} event - Promise rejection event
 */
function handleUnhandledRejection(event) {
    const error = event.reason;
    
    logger.error('Unhandled promise rejection', error, 'ErrorBoundary');
    
    // Show user-friendly error message
    showErrorNotification('An operation failed. Please try again.');
    
    // Prevent default browser error handling
    event.preventDefault();
}

/**
 * Show user-friendly error notification
 * @param {string} message - Error message to display
 */
function showErrorNotification(message) {
    // Check if notification already exists
    let notification = document.getElementById('global-error-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'global-error-notification';
        
        notification.innerHTML = `
            <span class="error-notification-icon">⚠️</span>
            <div class="error-notification-content">
                <p class="error-notification-message">${message}</p>
            </div>
            <button id="dismiss-error" class="error-notification-close" aria-label="Close notification">
                ×
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Add dismiss handler
        const dismissBtn = notification.querySelector('#dismiss-error');
        dismissBtn.addEventListener('click', () => {
            notification.classList.add('dismissing');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('dismissing');
                setTimeout(() => notification.remove(), 300);
            }
        }, 10000);
    } else {
        // Update existing notification
        const messageEl = notification.querySelector('.error-notification-message');
        if (messageEl) {
            messageEl.textContent = message;
        }
    }
}

/**
 * Error handling wrapper for async operations
 * Provides consistent error handling and logging
 * @param {Function} fn - Async function to execute
 * @param {string} context - Context/name for logging
 * @returns {Promise<*>} Result of the function or throws error
 * @example
 * await withErrorHandling(async () => {
 *     return await apiClient.getHotels();
 * }, 'HotelLoading');
 */
export async function withErrorHandling(fn, context = 'Unknown') {
    try {
        return await fn();
    } catch (error) {
        logger.error(`Error in ${context}`, error, context);
        throw error; // Re-throw after logging
    }
}

/**
 * Error handling wrapper for sync operations
 * Provides consistent error handling and logging for synchronous code
 * @param {Function} fn - Function to execute
 * @param {string} context - Context/name for logging
 * @returns {*} Result of the function or throws error
 * @example
 * withSyncErrorHandling(() => {
 *     return JSON.parse(data);
 * }, 'JSONParsing');
 */
export function withSyncErrorHandling(fn, context = 'Unknown') {
    try {
        return fn();
    } catch (error) {
        logger.error(`Error in ${context}`, error, context);
        throw error; // Re-throw after logging
    }
}

/**
 * Safe async wrapper that catches errors and shows user notification
 * Use for UI event handlers to prevent unhandled rejections
 * @param {Function} fn - Async function to execute
 * @param {string} context - Context/name for logging
 * @param {string} userMessage - User-friendly error message
 * @returns {Promise<void>}
 * @example
 * button.addEventListener('click', () => safeAsync(async () => {
 *     await apiClient.searchVacancies(...);
 * }, 'SearchButton', 'Failed to search vacancies'));
 */
export async function safeAsync(fn, context = 'Unknown', userMessage = 'An error occurred') {
    try {
        await fn();
    } catch (error) {
        logger.error(`Error in ${context}`, error, context);
        showErrorNotification(userMessage);
    }
}

/**
 * Initialize application on DOM ready
 */
function initializeApp() {
    logger.info('Application initialized', 'App');
    
    // Register global error handlers
    window.addEventListener('error', handleUncaughtError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    logger.debug('Global error boundaries registered', 'ErrorBoundary');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

export { initializeApp, handleUncaughtError, handleUnhandledRejection, showErrorNotification };
