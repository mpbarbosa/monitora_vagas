/**
 * Search Form Focus Trap Module
 * Implements focus trap for search form to enhance keyboard navigation
 * WCAG 2.1 Level AA compliance for keyboard accessibility
 * @version 1.0.0
 */

import { logger } from '../services/logger.js';

const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * SearchFormFocusTrap class
 * Manages focus trapping within the search form for better keyboard navigation
 */
class SearchFormFocusTrap {
    constructor() {
        this.formElement = null;
        this.focusableElements = [];
        this.firstFocusable = null;
        this.lastFocusable = null;
        this.isActive = false;
        this.lastFocusedElement = null;
    }

    /**
     * Initialize the focus trap
     */
    init() {
        this.formElement = document.getElementById('search-form');
        
        if (!this.formElement) {
            logger.warn('Search form not found, focus trap not initialized', 'FocusTrap');
            return;
        }

        this.setupFocusTrap();
        this.setupEventListeners();
        logger.info('Search form focus trap initialized', 'FocusTrap');
    }

    /**
     * Set up focus trap configuration
     */
    setupFocusTrap() {
        this.updateFocusableElements();
        
        // Update focusable elements when DOM changes
        const observer = new MutationObserver(() => {
            if (this.isActive) {
                this.updateFocusableElements();
            }
        });

        observer.observe(this.formElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'tabindex']
        });
    }

    /**
     * Update list of focusable elements
     */
    updateFocusableElements() {
        this.focusableElements = Array.from(
            this.formElement.querySelectorAll(FOCUSABLE_SELECTOR)
        );

        if (this.focusableElements.length > 0) {
            this.firstFocusable = this.focusableElements[0];
            this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
        }

        logger.debug(`Updated focusable elements: ${this.focusableElements.length}`, 'FocusTrap');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Activate trap when form receives focus
        this.formElement.addEventListener('focusin', (event) => {
            if (!this.isActive && this.isFormElement(event.target)) {
                this.activate();
            }
        });

        // Deactivate when focus leaves form (with delay to handle internal focus changes)
        this.formElement.addEventListener('focusout', (event) => {
            setTimeout(() => {
                if (!this.formElement.contains(document.activeElement)) {
                    this.deactivate();
                }
            }, 10);
        });

        // Handle Tab key navigation
        this.formElement.addEventListener('keydown', (event) => {
            if (event.key === 'Tab' && this.isActive) {
                this.handleTabKey(event);
            }

            // Escape key exits trap
            if (event.key === 'Escape' && this.isActive) {
                this.deactivate();
                event.preventDefault();
            }
        });

        // Deactivate when form is submitted
        this.formElement.addEventListener('submit', () => {
            this.deactivate();
        });

        logger.debug('Focus trap event listeners configured', 'FocusTrap');
    }

    /**
     * Handle Tab key navigation within trap
     */
    handleTabKey(event) {
        if (this.focusableElements.length === 0) return;

        const activeElement = document.activeElement;

        // Tab forward
        if (!event.shiftKey) {
            if (activeElement === this.lastFocusable) {
                event.preventDefault();
                this.firstFocusable.focus();
                logger.debug('Focus wrapped to first element', 'FocusTrap');
            }
        }
        // Tab backward (Shift+Tab)
        else {
            if (activeElement === this.firstFocusable) {
                event.preventDefault();
                this.lastFocusable.focus();
                logger.debug('Focus wrapped to last element', 'FocusTrap');
            }
        }
    }

    /**
     * Check if element is part of the form
     */
    isFormElement(element) {
        return this.formElement.contains(element);
    }

    /**
     * Activate the focus trap
     */
    activate() {
        if (this.isActive) return;

        this.lastFocusedElement = document.activeElement;
        this.isActive = true;
        this.updateFocusableElements();
        
        // Add visual indicator (optional)
        this.formElement.setAttribute('data-focus-trapped', 'true');
        
        logger.info('Focus trap activated', 'FocusTrap');
        
        // Announce to screen readers
        this.announceToScreenReader('Navegando no formulário de busca. Pressione Escape para sair.');
    }

    /**
     * Deactivate the focus trap
     */
    deactivate() {
        if (!this.isActive) return;

        this.isActive = false;
        
        // Remove visual indicator
        this.formElement.removeAttribute('data-focus-trapped');
        
        logger.info('Focus trap deactivated', 'FocusTrap');
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /**
     * Focus first element in form
     */
    focusFirst() {
        if (this.firstFocusable) {
            this.firstFocusable.focus();
            this.activate();
        }
    }

    /**
     * Check if trap is active
     */
    isTrapped() {
        return this.isActive;
    }
}

// Singleton instance
let focusTrapInstance = null;

/**
 * Initialize search form focus trap
 * @returns {SearchFormFocusTrap} Focus trap instance
 */
export function initSearchFormFocusTrap() {
    if (!focusTrapInstance) {
        focusTrapInstance = new SearchFormFocusTrap();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                focusTrapInstance.init();
            });
        } else {
            focusTrapInstance.init();
        }
    }
    
    return focusTrapInstance;
}

/**
 * Get focus trap instance
 * @returns {SearchFormFocusTrap|null} Focus trap instance or null
 */
export function getFocusTrap() {
    return focusTrapInstance;
}

// Auto-initialize when module loads
initSearchFormFocusTrap();

export { SearchFormFocusTrap };
