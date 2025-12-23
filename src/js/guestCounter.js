/**
 * Guest Counter Handler with Filter State Management (FR-004A)
 * @version 2.0.0
 */

import { GuestNumberFilter } from './guestNumberFilter.js';
import { logger } from '../services/logger.js';

// Guest Filter State Manager
const GuestFilterStateManager = {
        filterCard: null,
        isEnabled: false,
        
        init: function() {
            this.filterCard = document.getElementById('guest-filter-card');
            if (this.filterCard) {
                // Set initial disabled state
                this.disable();
                logger.debug('Guest filter initialized in disabled state', 'FR-004A');
            }
        },
        
        disable: function() {
            if (!this.filterCard) return;
            
            this.filterCard.classList.remove('filter-enabled');
            this.filterCard.classList.add('filter-disabled');
            this.filterCard.setAttribute('aria-disabled', 'true');
            this.isEnabled = false;
            
            // Disable interactive elements
            const input = this.filterCard.querySelector('.quantity');
            if (input) {
                input.setAttribute('readonly', 'readonly');
            }
            
            logger.debug('Guest filter disabled', 'GuestFilter');
        },
        
        enable: function() {
            if (!this.filterCard) return;
            
            this.filterCard.classList.remove('filter-disabled');
            this.filterCard.classList.add('filter-enabled');
            this.filterCard.setAttribute('aria-disabled', 'false');
            this.isEnabled = true;
            
            // Enable interactive elements
            const input = this.filterCard.querySelector('.quantity');
            if (input) {
                input.removeAttribute('readonly');
            }
            
            logger.debug('Guest filter enabled', 'GuestFilter');
        },
        
        isFilterEnabled: function() {
            return this.isEnabled;
        }
    };

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
                
                currentValue++;
                input.value = currentValue;
                
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
                    currentValue--;
                    input.value = currentValue;
                    
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
