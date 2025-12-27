/**
 * Optimistic UI Service
 * Provides immediate visual feedback before async operations complete
 * Enhances perceived performance and user experience
 * 
 * @module optimisticUI
 * @version 1.0.0
 */

import { logger } from './logger.js';

/**
 * OptimisticUI class
 * Manages optimistic updates with rollback capability
 */
class OptimisticUI {
    constructor() {
        this.pendingUpdates = new Map();
        this.animations = new Map();
    }

    /**
     * Apply optimistic update to an element
     * @param {Object} options - Update options
     * @param {string} options.id - Unique identifier for this update
     * @param {HTMLElement} options.element - Target element
     * @param {Function} options.optimisticUpdate - Function to apply optimistic changes
     * @param {Function} [options.rollback] - Function to rollback if operation fails
     * @param {number} [options.timeout=5000] - Auto-rollback timeout in ms
     * @returns {Object} Update controller
     */
    apply({ id, element, optimisticUpdate, rollback = null, timeout = 5000 }) {
        // Store original state for potential rollback
        const originalState = this.captureState(element);

        // Apply optimistic update
        try {
            optimisticUpdate(element);
            
            // Add optimistic indicator
            this.addOptimisticIndicator(element);
            
            // Store update info
            this.pendingUpdates.set(id, {
                element,
                originalState,
                rollback,
                timestamp: Date.now()
            });

            // Set auto-rollback timeout
            const timeoutId = setTimeout(() => {
                logger.warn(`Optimistic update timeout: ${id}`, 'OptimisticUI');
                this.rollback(id);
            }, timeout);

            logger.debug(`Optimistic update applied: ${id}`, 'OptimisticUI');

            // Return controller
            return {
                id,
                commit: () => this.commit(id, timeoutId),
                rollback: () => this.rollback(id, timeoutId),
                isPending: () => this.pendingUpdates.has(id)
            };
        } catch (error) {
            logger.error(`Failed to apply optimistic update: ${id}`, error, 'OptimisticUI');
            throw error;
        }
    }

    /**
     * Commit optimistic update (operation succeeded)
     * @param {string} id - Update identifier
     * @param {number} [timeoutId] - Timeout to clear
     */
    commit(id, timeoutId = null) {
        const update = this.pendingUpdates.get(id);
        if (!update) return;

        // Clear timeout
        if (timeoutId) clearTimeout(timeoutId);

        // Remove optimistic indicator
        this.removeOptimisticIndicator(update.element);

        // Clean up
        this.pendingUpdates.delete(id);

        logger.debug(`Optimistic update committed: ${id}`, 'OptimisticUI');
    }

    /**
     * Rollback optimistic update (operation failed)
     * @param {string} id - Update identifier
     * @param {number} [timeoutId] - Timeout to clear
     */
    rollback(id, timeoutId = null) {
        const update = this.pendingUpdates.get(id);
        if (!update) return;

        // Clear timeout
        if (timeoutId) clearTimeout(timeoutId);

        const { element, originalState, rollback } = update;

        // Apply rollback
        if (rollback) {
            rollback(element);
        } else {
            this.restoreState(element, originalState);
        }

        // Remove optimistic indicator
        this.removeOptimisticIndicator(element);

        // Clean up
        this.pendingUpdates.delete(id);

        logger.debug(`Optimistic update rolled back: ${id}`, 'OptimisticUI');
    }

    /**
     * Capture element state
     * @private
     */
    captureState(element) {
        return {
            html: element.innerHTML,
            classes: Array.from(element.classList),
            attributes: Array.from(element.attributes).map(attr => ({
                name: attr.name,
                value: attr.value
            })),
            styles: element.getAttribute('style')
        };
    }

    /**
     * Restore element state
     * @private
     */
    restoreState(element, state) {
        element.innerHTML = state.html;
        element.className = state.classes.join(' ');
        
        // Restore attributes
        Array.from(element.attributes).forEach(attr => {
            if (!state.attributes.some(a => a.name === attr.name)) {
                element.removeAttribute(attr.name);
            }
        });
        
        state.attributes.forEach(attr => {
            element.setAttribute(attr.name, attr.value);
        });
    }

    /**
     * Add visual indicator for optimistic update
     * @private
     */
    addOptimisticIndicator(element) {
        element.classList.add('optimistic-updating');
        element.setAttribute('aria-busy', 'true');
    }

    /**
     * Remove optimistic indicator
     * @private
     */
    removeOptimisticIndicator(element) {
        element.classList.remove('optimistic-updating');
        element.removeAttribute('aria-busy');
    }

    /**
     * Animate element change
     * @param {HTMLElement} element - Target element
     * @param {string} [animation='pulse'] - Animation type
     * @returns {Promise} Resolves when animation completes
     */
    animate(element, animation = 'pulse') {
        return new Promise((resolve) => {
            const animationClass = `optimistic-${animation}`;
            
            element.classList.add(animationClass);
            
            const handler = () => {
                element.classList.remove(animationClass);
                element.removeEventListener('animationend', handler);
                resolve();
            };
            
            element.addEventListener('animationend', handler);
            
            // Fallback timeout
            setTimeout(() => {
                if (element.classList.contains(animationClass)) {
                    element.classList.remove(animationClass);
                    resolve();
                }
            }, 1000);
        });
    }

    /**
     * Show instant feedback for counter changes
     * @param {HTMLElement} element - Counter element
     * @param {number} newValue - New counter value
     * @param {string} [direction='up'] - Animation direction (up/down)
     */
    async updateCounter(element, newValue, direction = 'up') {
        const oldValue = parseInt(element.textContent) || 0;
        
        // Immediate update
        element.textContent = newValue;
        
        // Add animation class
        const animClass = direction === 'up' ? 'count-up' : 'count-down';
        element.classList.add(animClass);
        
        await this.animate(element, animClass);
        
        logger.debug(`Counter updated: ${oldValue} → ${newValue}`, 'OptimisticUI');
    }

    /**
     * Show instant feedback for filter changes
     * @param {HTMLElement} container - Results container
     * @param {number} visibleCount - Number of visible items
     * @param {number} totalCount - Total number of items
     */
    updateFilterResults(container, visibleCount, totalCount) {
        // Add filtering indicator
        container.classList.add('optimistic-filtering');
        
        // Update counter immediately
        const counter = document.getElementById('results-counter');
        if (counter) {
            counter.style.display = 'block';
            counter.innerHTML = `
                <span class="optimistic-updating">
                    Mostrando <strong>${visibleCount}</strong> de <strong>${totalCount}</strong> hotéis
                </span>
            `;
        }
        
        // Remove indicator after short delay
        setTimeout(() => {
            container.classList.remove('optimistic-filtering');
            if (counter) {
                const updatingSpan = counter.querySelector('.optimistic-updating');
                if (updatingSpan) {
                    updatingSpan.classList.remove('optimistic-updating');
                }
            }
        }, 300);
        
        logger.debug(`Filter results updated: ${visibleCount}/${totalCount}`, 'OptimisticUI');
    }

    /**
     * Show skeleton loading state
     * @param {HTMLElement} container - Container element
     * @param {number} [count=3] - Number of skeleton items
     */
    showSkeleton(container, count = 3) {
        const skeletons = Array.from({ length: count }, (_, i) => `
            <div class="skeleton-card" role="status" aria-label="Carregando...">
                <div class="skeleton-header"></div>
                <div class="skeleton-body">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = skeletons;
        container.classList.add('skeleton-loading');
        
        logger.debug(`Skeleton loading shown: ${count} items`, 'OptimisticUI');
    }

    /**
     * Hide skeleton loading state
     * @param {HTMLElement} container - Container element
     */
    hideSkeleton(container) {
        container.classList.remove('skeleton-loading');
        logger.debug('Skeleton loading hidden', 'OptimisticUI');
    }

    /**
     * Highlight changed elements
     * @param {HTMLElement} element - Element to highlight
     * @param {string} [type='success'] - Highlight type (success/warning/error)
     */
    async highlight(element, type = 'success') {
        element.classList.add(`optimistic-highlight-${type}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        element.classList.remove(`optimistic-highlight-${type}`);
    }

    /**
     * Clean up all pending updates
     */
    cleanup() {
        this.pendingUpdates.forEach((update, id) => {
            this.rollback(id);
        });
        this.pendingUpdates.clear();
        logger.debug('All optimistic updates cleaned up', 'OptimisticUI');
    }

    /**
     * Get pending update count
     * @returns {number} Number of pending updates
     */
    getPendingCount() {
        return this.pendingUpdates.size;
    }
}

// Export singleton instance
export const optimisticUI = new OptimisticUI();

export { OptimisticUI };
