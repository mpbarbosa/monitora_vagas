/**
 * Progress Indicator Service
 * Provides visual progress feedback during API calls and long operations
 * WCAG 2.1 Level AA compliant with ARIA live regions
 * 
 * @module progressIndicator
 * @version 1.0.0
 */

import { logger } from './logger.js';

const PROGRESS_STATES = {
    READY: 'ready',
    LOADING: 'searching',
    COMPLETED: 'completed',
    ERROR: 'error'
};

const PROGRESS_ICONS = {
    ready: '⏳',
    searching: '🔄',
    completed: '✓',
    error: '✕'
};

/**
 * ProgressIndicator class
 * Manages progress indicators for async operations
 */
class ProgressIndicator {
    constructor() {
        this.activeIndicators = new Map();
        this.containerElement = null;
    }

    /**
     * Create and show a progress indicator
     * @param {Object} options - Progress indicator options
     * @param {string} [options.id] - Unique identifier (auto-generated if not provided)
     * @param {string} [options.title='Loading...'] - Progress title
     * @param {string} [options.message='Please wait'] - Progress message
     * @param {HTMLElement} [options.container] - Container element (defaults to body)
     * @param {boolean} [options.showProgress=true] - Show progress bar
     * @param {boolean} [options.inline=false] - Inline mode (no container styling)
     * @returns {Object} Progress indicator control object
     */
    create({ 
        id = `progress-${Date.now()}`, 
        title = 'Loading...', 
        message = 'Please wait',
        container = null,
        showProgress = true,
        inline = false
    } = {}) {
        // Check if already exists
        if (this.activeIndicators.has(id)) {
            logger.warn(`Progress indicator with id '${id}' already exists`, 'ProgressIndicator');
            return this.activeIndicators.get(id);
        }

        // Create progress element
        const progressElement = this.createProgressElement({
            title,
            message,
            showProgress,
            inline
        });

        // Add to container
        const targetContainer = container || document.body;
        targetContainer.appendChild(progressElement);

        // Create control object
        const controller = {
            id,
            element: progressElement,
            progressBar: progressElement.querySelector('.progress-fill'),
            statusElement: progressElement.querySelector('.progress-status'),
            messageElement: progressElement.querySelector('.progress-message'),
            
            /**
             * Update progress percentage
             * @param {number} percent - Progress percentage (0-100)
             */
            setProgress: (percent) => {
                if (this.progressBar) {
                    const clampedPercent = Math.max(0, Math.min(100, percent));
                    this.progressBar.style.width = `${clampedPercent}%`;
                    this.progressBar.setAttribute('aria-valuenow', clampedPercent);
                }
            },

            /**
             * Update message text
             * @param {string} text - New message
             */
            setMessage: (text) => {
                if (this.messageElement) {
                    this.messageElement.textContent = text;
                }
            },

            /**
             * Set state to completed
             * @param {string} [message] - Completion message
             */
            complete: (message = 'Completed successfully') => {
                this.setState(PROGRESS_STATES.COMPLETED, message);
                if (this.progressBar) {
                    this.progressBar.style.width = '100%';
                }
            },

            /**
             * Set state to error
             * @param {string} [message] - Error message
             */
            error: (message = 'An error occurred') => {
                this.setState(PROGRESS_STATES.ERROR, message);
            },

            /**
             * Update state
             * @param {string} state - New state
             * @param {string} [message] - Status message
             */
            setState: (state, message) => {
                if (this.statusElement) {
                    this.statusElement.className = `progress-status ${state}`;
                    const icon = PROGRESS_ICONS[state] || '';
                    const statusText = message || this.statusElement.textContent;
                    this.statusElement.innerHTML = `
                        <span class="status-icon ${state === PROGRESS_STATES.LOADING ? 'spinning' : ''}" aria-hidden="true">${icon}</span>
                        <span>${statusText}</span>
                    `;
                }
            },

            /**
             * Remove progress indicator
             * @param {number} [delay=0] - Delay before removal (ms)
             */
            remove: (delay = 0) => {
                setTimeout(() => {
                    if (this.element && this.element.parentNode) {
                        this.element.classList.add('progress-fade-out');
                        setTimeout(() => {
                            if (this.element && this.element.parentNode) {
                                this.element.parentNode.removeChild(this.element);
                            }
                            activeIndicators.delete(id);
                            logger.debug(`Progress indicator removed: ${id}`, 'ProgressIndicator');
                        }, 300);
                    }
                }, delay);
            }
        };

        // Store controller
        this.activeIndicators.set(id, controller);

        logger.debug(`Progress indicator created: ${id}`, 'ProgressIndicator');
        return controller;
    }

    /**
     * Create progress DOM element
     * @private
     */
    createProgressElement({ title, message, showProgress, inline }) {
        const container = document.createElement('div');
        container.className = inline ? 'progress-inline' : 'progress-container';
        container.setAttribute('role', 'status');
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-busy', 'true');

        const header = document.createElement('div');
        header.className = 'progress-header';
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        header.appendChild(titleElement);

        container.appendChild(header);

        // Progress bar
        if (showProgress) {
            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'progress-bar';
            progressBarContainer.setAttribute('role', 'progressbar');
            progressBarContainer.setAttribute('aria-valuemin', '0');
            progressBarContainer.setAttribute('aria-valuemax', '100');
            progressBarContainer.setAttribute('aria-valuenow', '0');

            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = '0%';

            progressBarContainer.appendChild(progressFill);
            container.appendChild(progressBarContainer);
        }

        // Status section
        const status = document.createElement('div');
        status.className = `progress-status ${PROGRESS_STATES.LOADING}`;
        status.innerHTML = `
            <span class="status-icon spinning" aria-hidden="true">${PROGRESS_ICONS.searching}</span>
            <span class="progress-message">${message}</span>
        `;

        container.appendChild(status);

        return container;
    }

    /**
     * Create a simple spinner (lightweight alternative)
     * @param {HTMLElement} container - Container element
     * @param {string} [message='Loading...'] - Loading message
     * @returns {Object} Spinner control object
     */
    createSpinner(container, message = 'Loading...') {
        const spinner = document.createElement('div');
        spinner.className = 'spinner-container';
        spinner.setAttribute('role', 'status');
        spinner.setAttribute('aria-live', 'polite');
        spinner.innerHTML = `
            <div class="spinner" aria-hidden="true"></div>
            <span class="spinner-message">${message}</span>
            <span class="sr-only">${message}</span>
        `;

        container.appendChild(spinner);

        return {
            element: spinner,
            setMessage: (text) => {
                const messageEl = spinner.querySelector('.spinner-message');
                const srEl = spinner.querySelector('.sr-only');
                if (messageEl) messageEl.textContent = text;
                if (srEl) srEl.textContent = text;
            },
            remove: () => {
                if (spinner.parentNode) {
                    spinner.parentNode.removeChild(spinner);
                }
            }
        };
    }

    /**
     * Show button loading state
     * @param {HTMLButtonElement} button - Button element
     * @param {string} [loadingText='Loading...'] - Loading text
     * @returns {Function} Restore function
     */
    setButtonLoading(button, loadingText = 'Loading...') {
        const originalText = button.innerHTML;
        const originalDisabled = button.disabled;

        button.disabled = true;
        button.innerHTML = `
            <span class="spinner-small" aria-hidden="true"></span>
            ${loadingText}
        `;

        // Return restore function
        return () => {
            button.disabled = originalDisabled;
            button.innerHTML = originalText;
        };
    }

    /**
     * Wrap an async operation with progress indicator
     * @param {Function} asyncFn - Async function to execute
     * @param {Object} options - Progress indicator options
     * @returns {Promise} Promise from the async function
     */
    async withProgress(asyncFn, options = {}) {
        const progress = this.create(options);

        try {
            const result = await asyncFn(progress);
            progress.complete();
            
            // Auto-remove after 2 seconds
            progress.remove(2000);
            
            return result;
        } catch (error) {
            progress.error(error.message || 'Operation failed');
            
            // Auto-remove after 3 seconds
            progress.remove(3000);
            
            throw error;
        }
    }

    /**
     * Remove all active indicators
     */
    removeAll() {
        this.activeIndicators.forEach(indicator => indicator.remove());
    }

    /**
     * Get active indicator by ID
     * @param {string} id - Indicator ID
     * @returns {Object|null} Indicator controller or null
     */
    get(id) {
        return this.activeIndicators.get(id) || null;
    }
}

// Export singleton instance
export const progressIndicator = new ProgressIndicator();

// Export constants
export { PROGRESS_STATES, PROGRESS_ICONS };
