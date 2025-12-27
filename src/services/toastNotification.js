/**
 * Toast Notification Service
 * Provides accessible, non-blocking notifications for user feedback
 * Replaces alert() for better UX and accessibility
 * 
 * @module toastNotification
 */

import { logger } from './logger.js';

const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

const TOAST_DURATIONS = {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000
};

const TOAST_ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
};

class ToastNotification {
    constructor() {
        this.container = null;
        this.activeToasts = new Set();
        this.initialized = false;
    }

    /**
     * Initialize toast container (called automatically on first toast)
     */
    init() {
        if (this.initialized) return;

        // Create toast container
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', 'Notifications');
        this.container.setAttribute('aria-live', 'polite');
        
        document.body.appendChild(this.container);
        this.initialized = true;
        
        logger.debug('Toast notification system initialized', 'ToastNotification');
    }

    /**
     * Show a toast notification
     * @param {Object} options - Toast options
     * @param {string} options.message - Message to display
     * @param {string} [options.type='info'] - Toast type (success, error, warning, info)
     * @param {number} [options.duration=5000] - Duration in milliseconds (0 = manual dismiss)
     * @param {boolean} [options.dismissible=true] - Allow manual dismissal
     * @param {boolean} [options.pauseOnHover=true] - Pause auto-dismiss on hover
     * @returns {HTMLElement} The toast element
     */
    show({ message, type = TOAST_TYPES.INFO, duration = TOAST_DURATIONS.MEDIUM, dismissible = true, pauseOnHover = true }) {
        if (!this.initialized) {
            this.init();
        }

        // Validate type
        if (!Object.values(TOAST_TYPES).includes(type)) {
            logger.warn(`Invalid toast type: ${type}, defaulting to info`, 'ToastNotification');
            type = TOAST_TYPES.INFO;
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', type === TOAST_TYPES.ERROR ? 'alert' : 'status');
        toast.setAttribute('aria-live', type === TOAST_TYPES.ERROR ? 'assertive' : 'polite');
        
        // Add duration data attribute for CSS animation
        if (duration > 0) {
            toast.setAttribute('data-duration', 'true');
            toast.style.setProperty('--duration', `${duration}ms`);
        }

        // Create icon
        const icon = document.createElement('span');
        icon.className = 'toast-icon';
        icon.textContent = TOAST_ICONS[type];
        icon.setAttribute('aria-hidden', 'true');

        // Create message
        const messageEl = document.createElement('span');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;

        // Create close button (if dismissible)
        let closeBtn = null;
        if (dismissible) {
            closeBtn = document.createElement('button');
            closeBtn.className = 'toast-close';
            closeBtn.textContent = '×';
            closeBtn.setAttribute('aria-label', 'Fechar notificação');
            closeBtn.setAttribute('type', 'button');
            closeBtn.addEventListener('click', () => this.dismiss(toast));
        }

        // Assemble toast
        toast.appendChild(icon);
        toast.appendChild(messageEl);
        if (dismissible) {
            toast.appendChild(closeBtn);
        }

        // Add to container
        this.container.appendChild(toast);
        this.activeToasts.add(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('toast-show'), 10);

        // Auto-dismiss setup
        let dismissTimeout = null;
        if (duration > 0) {
            dismissTimeout = setTimeout(() => this.dismiss(toast), duration);
            
            // Pause on hover
            if (pauseOnHover) {
                let remainingTime = duration;
                let startTime = Date.now();
                
                toast.addEventListener('mouseenter', () => {
                    clearTimeout(dismissTimeout);
                    remainingTime -= Date.now() - startTime;
                });
                
                toast.addEventListener('mouseleave', () => {
                    startTime = Date.now();
                    dismissTimeout = setTimeout(() => this.dismiss(toast), remainingTime);
                });
            }
        }

        logger.debug(`Toast shown: ${type} - ${message}`, 'ToastNotification');
        return toast;
    }

    /**
     * Dismiss a toast notification
     * @param {HTMLElement} toast - Toast element to dismiss
     */
    dismiss(toast) {
        if (!toast || !this.activeToasts.has(toast)) return;

        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.activeToasts.delete(toast);
        }, 300); // Match CSS transition duration
    }

    /**
     * Dismiss all active toasts
     */
    dismissAll() {
        this.activeToasts.forEach(toast => this.dismiss(toast));
    }

    /**
     * Convenience methods for different toast types
     */
    success(message, duration = TOAST_DURATIONS.MEDIUM) {
        return this.show({ message, type: TOAST_TYPES.SUCCESS, duration });
    }

    error(message, duration = TOAST_DURATIONS.LONG) {
        return this.show({ message, type: TOAST_TYPES.ERROR, duration });
    }

    warning(message, duration = TOAST_DURATIONS.MEDIUM) {
        return this.show({ message, type: TOAST_TYPES.WARNING, duration });
    }

    info(message, duration = TOAST_DURATIONS.MEDIUM) {
        return this.show({ message, type: TOAST_TYPES.INFO, duration });
    }
    
    /**
     * Replace native alert() with accessible toast
     * @param {string} message - Message to display
     * @param {string} [type='info'] - Toast type
     */
    alert(message, type = TOAST_TYPES.INFO) {
        return this.show({ 
            message, 
            type, 
            duration: 0, // Requires manual dismiss like alert()
            dismissible: true 
        });
    }
}

// Export singleton instance
export const toast = new ToastNotification();

// Replace global alert() with toast (optional - uncomment to activate)
// window.alert = (message) => toast.alert(String(message));

// Export constants for external use
export { TOAST_TYPES, TOAST_DURATIONS };
