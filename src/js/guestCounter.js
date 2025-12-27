/**
 * Guest Counter Handler with Filter State Management (FR-004A)
 * @version 2.2.0
 * Refactored to functional programming pattern with closures
 */

import { GuestNumberFilter } from './guestNumberFilter.js';
import { logger } from '../services/logger.js';
import { CSS_CLASSES } from '../config/constants.js';
import { optimisticUI } from '../services/optimisticUI.js';

/**
 * Guest Filter State Manager using closure pattern (no 'this')
 * @returns {Object} Public API for guest filter state management
 */
function createGuestFilterStateManager() {
    // Private state (closure variables)
    let filterCard = null;
    let isEnabled = false;
    
    /**
     * Initialize the filter card
     */
    const init = () => {
        filterCard = document.getElementById('guest-filter-card');
        if (filterCard) {
            // Set initial disabled state
            disable();
            logger.debug('Guest filter initialized in disabled state', 'FR-004A');
        }
    };
    
    /**
     * Disable the guest filter
     */
    const disable = () => {
        if (!filterCard) return;
        
        filterCard.classList.remove(CSS_CLASSES.FILTER_ENABLED);
        filterCard.classList.add(CSS_CLASSES.FILTER_DISABLED);
        filterCard.setAttribute('aria-disabled', 'true');
        isEnabled = false;
        
        // Disable interactive elements
        const input = filterCard.querySelector('.quantity');
        if (input) {
            input.setAttribute('readonly', 'readonly');
        }
        
        logger.debug('Guest filter disabled', 'GuestFilter');
    };
    
    /**
     * Enable the guest filter
     */
    const enable = () => {
        if (!filterCard) return;
        
        filterCard.classList.remove(CSS_CLASSES.FILTER_DISABLED);
        filterCard.classList.add(CSS_CLASSES.FILTER_ENABLED);
        filterCard.setAttribute('aria-disabled', 'false');
        isEnabled = true;
        
        // Enable interactive elements
        const input = filterCard.querySelector('.quantity');
        if (input) {
            input.removeAttribute('readonly');
        }
        
        logger.debug('Guest filter enabled', 'GuestFilter');
    };
    
    /**
     * Check if filter is enabled
     * @returns {boolean} Filter enabled state
     */
    const isFilterEnabled = () => isEnabled;
    
    // Return public API
    return {
        init,
        disable,
        enable,
        isFilterEnabled
    };
}

// Create singleton instance
const GuestFilterStateManager = createGuestFilterStateManager();

    function initGuestCounter() {
        const numberInputs = document.querySelectorAll('.js-number-input');
        
        numberInputs.forEach(function(numberInput) {
            const input = numberInput.querySelector('.quantity');
            const plusBtn = numberInput.querySelector('.plus');
            const minusBtn = numberInput.querySelector('.minus');
            
            if (!input || !plusBtn || !minusBtn) return;
            
            // Get initial value
            let currentValue = parseInt(input.value) || 2;
            
            plusBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Check if filter is enabled (FR-004A)
                if (!GuestFilterStateManager.isFilterEnabled()) {
                    logger.warn('Guest filter is disabled. Complete a search first.', 'GuestFilter');
                    return;
                }
                
                const oldValue = currentValue;
                currentValue++;
                
                // Optimistic UI update
                optimisticUI.updateCounter(input, currentValue, 'up');
                
                // Apply guest number filter (FR-004B)
                GuestNumberFilter.applyFilter(currentValue);
            });
            
            minusBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Check if filter is enabled (FR-004A)
                if (!GuestFilterStateManager.isFilterEnabled()) {
                    logger.warn('Guest filter is disabled. Complete a search first.', 'GuestFilter');
                    return;
                }
                
                if (currentValue > 1) {
                    const oldValue = currentValue;
                    currentValue--;
                    
                    // Optimistic UI update
                    optimisticUI.updateCounter(input, currentValue, 'down');
                    
                    // Apply guest number filter (FR-004B)
                    GuestNumberFilter.applyFilter(currentValue);
                }
            });
        });
    }

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        GuestFilterStateManager.init();
        initGuestCounter();
    });
} else {
    GuestFilterStateManager.init();
    initGuestCounter();
}

export { GuestFilterStateManager, initGuestCounter };
