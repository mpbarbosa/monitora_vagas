/**
 * Keyboard Navigation Module
 * Implements keyboard shortcuts and enhanced navigation
 * WCAG 2.1 Level A compliance for keyboard accessibility
 */

import { logger } from '../services/logger.js';

const KEYBOARD_SHORTCUTS = {
    SEARCH: 'Alt+KeyS',
    RESET: 'Alt+KeyR',
    HELP: 'Ctrl+Slash',  // Changed from Shift+Slash to Ctrl+/
    CLEAR_RESULTS: 'Escape',  // Added ESC to clear results
    FOCUS_HOTEL: 'Alt+KeyH',
    FOCUS_CHECKIN: 'Alt+KeyI',
    FOCUS_CHECKOUT: 'Alt+KeyO',
    TOGGLE_BOOKING_RULES: 'Alt+KeyB'
};

class KeyboardNavigationManager {
    constructor() {
        this.shortcuts = new Map();
        this.helpVisible = false;
        this.init();
    }

    init() {
        logger.debug('Initializing keyboard navigation', 'KeyboardNavigation');
        this.setupKeyboardListeners();
        this.setupFocusTrap();
        this.enhanceTabOrder();
        this.setupHelpButton();
        logger.info('Keyboard navigation initialized', 'KeyboardNavigation');
    }

    /**
     * Set up global keyboard event listeners
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (event) => {
            const key = this.getKeyCombo(event);
            
            // Handle registered shortcuts
            if (this.shortcuts.has(key)) {
                event.preventDefault();
                this.shortcuts.get(key)(event);
                return;
            }

            // Handle special keys
            this.handleSpecialKeys(event);
        });

        // Register default shortcuts
        this.registerShortcut(KEYBOARD_SHORTCUTS.SEARCH, () => {
            this.triggerSearch();
        });

        this.registerShortcut(KEYBOARD_SHORTCUTS.RESET, () => {
            this.triggerReset();
        });

        this.registerShortcut(KEYBOARD_SHORTCUTS.HELP, () => {
            this.toggleHelp();
        });
        
        this.registerShortcut(KEYBOARD_SHORTCUTS.CLEAR_RESULTS, () => {
            this.clearResults();
        });

        this.registerShortcut(KEYBOARD_SHORTCUTS.FOCUS_HOTEL, () => {
            this.focusElement('hotel-select');
        });

        this.registerShortcut(KEYBOARD_SHORTCUTS.FOCUS_CHECKIN, () => {
            this.focusElement('input-checkin');
        });

        this.registerShortcut(KEYBOARD_SHORTCUTS.FOCUS_CHECKOUT, () => {
            this.focusElement('input-checkout');
        });

        this.registerShortcut(KEYBOARD_SHORTCUTS.TOGGLE_BOOKING_RULES, () => {
            this.toggleBookingRules();
        });
    }

    /**
     * Get keyboard shortcut combo string
     */
    getKeyCombo(event) {
        const parts = [];
        if (event.ctrlKey) parts.push('Ctrl');
        if (event.altKey) parts.push('Alt');
        if (event.shiftKey) parts.push('Shift');
        if (event.metaKey) parts.push('Meta');
        parts.push(event.code);
        return parts.join('+');
    }

    /**
     * Register a keyboard shortcut
     */
    registerShortcut(combo, callback) {
        this.shortcuts.set(combo, callback);
        logger.debug(`Registered shortcut: ${combo}`, 'KeyboardNavigation');
    }

    /**
     * Handle special keyboard navigation keys
     */
    handleSpecialKeys(event) {
        // Escape key - close modals, clear focus
        if (event.key === 'Escape') {
            this.handleEscape();
        }

        // Arrow keys in hotel cards
        if (event.target.closest('.hotel-card')) {
            this.handleArrowNavigation(event);
        }
    }

    /**
     * Handle Escape key press
     */
    handleEscape() {
        // Hide help if visible
        if (this.helpVisible) {
            this.toggleHelp();
            return;
        }

        // Clear focus from active element
        if (document.activeElement) {
            document.activeElement.blur();
        }
    }

    /**
     * Handle arrow key navigation in result cards
     */
    handleArrowNavigation(event) {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            return;
        }

        const cards = Array.from(document.querySelectorAll('.hotel-card'));
        const currentCard = event.target.closest('.hotel-card');
        const currentIndex = cards.indexOf(currentCard);

        if (currentIndex === -1) return;

        let nextIndex;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % cards.length;
        } else {
            nextIndex = (currentIndex - 1 + cards.length) % cards.length;
        }

        event.preventDefault();
        cards[nextIndex].focus();
    }

    /**
     * Set up focus trap for modals/dialogs
     */
    setupFocusTrap() {
        // Monitor for dynamically created modals
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && (node.classList?.contains('modal') || node.role === 'dialog')) {
                        this.trapFocus(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Trap focus within a container
     */
    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        container.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });

        // Focus first element when modal opens
        firstElement.focus();
    }

    /**
     * Enhance tab order for logical navigation
     */
    enhanceTabOrder() {
        // Ensure search form elements have logical tab order
        const formElements = [
            'hotel-select',
            'input-checkin',
            'input-checkout',
            'booking-rules-toggle',
            'search-button'
        ];

        formElements.forEach((id, index) => {
            const element = document.getElementById(id);
            if (element && !element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', index + 1);
            }
        });

        // Make hotel cards keyboard focusable
        this.makeCardsKeyboardAccessible();
    }

    /**
     * Make hotel result cards keyboard accessible
     */
    makeCardsKeyboardAccessible() {
        const observer = new MutationObserver(() => {
            const cards = document.querySelectorAll('.hotel-card');
            cards.forEach((card) => {
                if (!card.hasAttribute('tabindex')) {
                    card.setAttribute('tabindex', '0');
                    card.setAttribute('role', 'article');
                    card.setAttribute('data-keyboard-focusable', 'true');
                    
                    // Add keyboard event listeners
                    card.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            // Trigger card action (if any)
                            const link = card.querySelector('a');
                            if (link) link.click();
                        }
                    });
                }
            });
        });

        const resultsContainer = document.getElementById('hotels-cards-container');
        if (resultsContainer) {
            observer.observe(resultsContainer, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * Add skip navigation links
     */
    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#search-form" class="skip-link">Pular para formulário de busca</a>
            <a href="#results-container" class="skip-link">Pular para resultados</a>
            <a href="#guest-filter-card" class="skip-link">Pular para filtro de hóspedes</a>
        `;
        document.body.insertBefore(skipLinks, document.body.firstChild);
        logger.debug('Skip links added', 'KeyboardNavigation');
    }

    /**
     * Trigger search action
     */
    triggerSearch() {
        const searchButton = document.getElementById('search-button');
        if (searchButton && !searchButton.disabled) {
            logger.debug('Keyboard shortcut: Search triggered (Alt+S)', 'KeyboardNavigation');
            searchButton.click();
        }
    }

    /**
     * Trigger reset action
     */
    triggerReset() {
        // Focus hotel select to start new search
        const hotelSelect = document.getElementById('hotel-select');
        if (hotelSelect) {
            hotelSelect.value = '';
            hotelSelect.focus();
            logger.debug('Keyboard shortcut: Reset triggered (Alt+R)', 'KeyboardNavigation');
        }
    }
    
    /**
     * Clear results
     */
    clearResults() {
        const resultsContainer = document.getElementById('results-container');
        // Only clear if results are visible
        if (resultsContainer && resultsContainer.classList.contains('visible')) {
            const clearBtn = document.getElementById('clear-results-btn');
            if (clearBtn) {
                clearBtn.click();
                logger.debug('Keyboard shortcut: Clear results triggered (ESC)', 'KeyboardNavigation');
            }
        }
    }

    /**
     * Toggle booking rules checkbox
     */
    toggleBookingRules() {
        const checkbox = document.getElementById('booking-rules-toggle');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
            logger.debug('Keyboard shortcut: Booking rules toggled', 'KeyboardNavigation');
        }
    }

    /**
     * Focus a specific element by ID
     */
    focusElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.focus();
            logger.debug(`Focused element: ${elementId}`, 'KeyboardNavigation');
        }
    }
    
    /**
     * Setup help button click handler
     */
    setupHelpButton() {
        const helpBtn = document.getElementById('keyboard-shortcuts-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.toggleHelp());
            logger.debug('Help button configured', 'KeyboardNavigation');
        }
    }

    /**
     * Toggle keyboard shortcuts help
     */
    toggleHelp() {
        this.helpVisible = !this.helpVisible;
        
        let helpPanel = document.getElementById('keyboard-shortcuts-help');
        
        if (!helpPanel) {
            helpPanel = this.createHelpPanel();
            document.body.appendChild(helpPanel);
        }
        
        helpPanel.classList.toggle('show', this.helpVisible);
        logger.debug(`Keyboard help ${this.helpVisible ? 'shown' : 'hidden'}`, 'KeyboardNavigation');
    }

    /**
     * Create keyboard shortcuts help panel
     */
    createHelpPanel() {
        const panel = document.createElement('div');
        panel.id = 'keyboard-shortcuts-help';
        panel.className = 'keyboard-shortcuts-help';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Atalhos de teclado');
        panel.setAttribute('aria-modal', 'false');
        
        panel.innerHTML = `
            <div class="keyboard-shortcuts-header">
                <h4>⌨️ Atalhos de Teclado</h4>
                <button class="keyboard-shortcuts-close" aria-label="Fechar ajuda">×</button>
            </div>
            <ul class="keyboard-shortcuts-list">
                <li>
                    <span class="shortcut-label">Buscar</span>
                    <kbd>Alt + S</kbd>
                </li>
                <li>
                    <span class="shortcut-label">Nova Busca</span>
                    <kbd>Alt + R</kbd>
                </li>
                <li>
                    <span class="shortcut-label">Limpar Resultados</span>
                    <kbd>ESC</kbd>
                </li>
                <li>
                    <span class="shortcut-label">Focar Hotel</span>
                    <kbd>Alt + H</kbd>
                </li>
                <li>
                    <span class="shortcut-label">Focar Check-in</span>
                    <kbd>Alt + I</kbd>
                </li>
                <li>
                    <span class="shortcut-label">Focar Check-out</span>
                    <kbd>Alt + O</kbd>
                </li>
                <li>
                    <span class="shortcut-label">Regras de Reserva</span>
                    <kbd>Alt + B</kbd>
                </li>
                <li>
                    <span class="shortcut-label">Mostrar Ajuda</span>
                    <kbd>Ctrl + /</kbd>
                </li>
            </ul>
            <div class="keyboard-shortcuts-footer">
                <small>Pressione <kbd>ESC</kbd> para fechar</small>
            </div>
        `;
        
        // Add close button handler
        const closeBtn = panel.querySelector('.keyboard-shortcuts-close');
        closeBtn.addEventListener('click', () => this.toggleHelp());
        
        return panel;
    }
}

// Initialize keyboard navigation on DOM ready
let keyboardNav = null;

export function initKeyboardNavigation() {
    if (!keyboardNav) {
        keyboardNav = new KeyboardNavigationManager();
    }
    return keyboardNav;
}

// Auto-initialize when module loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKeyboardNavigation);
} else {
    initKeyboardNavigation();
}

export { KeyboardNavigationManager, KEYBOARD_SHORTCUTS };
