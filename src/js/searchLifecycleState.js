/**
 * Search Lifecycle UI State Management (FR-008A)
 * Manages enabled/disabled state of UI elements throughout the search lifecycle
 * @version 2.1.0
 * Refactored to functional programming pattern with closures
 */

import { GuestFilterStateManager } from './guestCounter.js';
import { logger } from '../services/logger.js';

/**
 * Create Search Lifecycle State Manager using closure pattern (no 'this')
 * @returns {Object} Public API for search lifecycle management
 */
function createSearchLifecycleState() {
    // Private state (closure variables)
    const elements = {
        hotelSelect: null,
        checkinInput: null,
        checkoutInput: null,
        guestPlusBtn: null,
        guestMinusBtn: null,
        guestInput: null,
        searchBtn: null,
        resetBtn: null,
        copyResultsBtn: null,
        clearResultsBtn: null,
        resultsContainer: null,
        hotelsCardsContainer: null
    };

    let currentState = 'initial'; // 'initial', 'searching', 'results'

    /**
     * Helper: Enable an element
     */
    const enableElement = (element) => {
        if (!element) return;
        
        element.disabled = false;
        element.style.opacity = '1';
        element.style.cursor = '';
        element.style.pointerEvents = '';
        element.removeAttribute('aria-disabled');
    };

    /**
     * Helper: Disable an element with visual indication
     */
    const disableElement = (element) => {
        if (!element) return;
        
        element.disabled = true;
        element.style.opacity = '0.5';
        element.style.cursor = 'not-allowed';
        element.setAttribute('aria-disabled', 'true');
    };

    /**
     * Helper: Show an element
     */
    const showElement = (element) => {
        if (!element) return;
        element.style.display = '';
        element.removeAttribute('aria-hidden');
    };

    /**
     * Helper: Hide an element
     */
    const hideElement = (element) => {
        if (!element) return;
        element.style.display = 'none';
        element.setAttribute('aria-hidden', 'true');
    };

    /**
     * Set guest buttons visual state (plus/minus)
     * @param {string} state - 'initial', 'searching', or 'results'
     */
    const setGuestButtonsState = (state) => {
        const buttons = [elements.guestPlusBtn, elements.guestMinusBtn];
        const states = ['state-initial', 'state-searching', 'state-results'];
        
        buttons.forEach((btn) => {
            if (!btn) return;
            
            // Remove all state classes
            states.forEach((stateClass) => {
                btn.classList.remove(stateClass);
            });
            
            // Add current state class
            btn.classList.add('state-' + state);
            
            // Set disabled property and aria-disabled attribute
            if (state === 'results') {
                btn.disabled = false;
                btn.setAttribute('aria-disabled', 'false');
            } else {
                btn.disabled = true;
                btn.setAttribute('aria-disabled', 'true');
            }
        });
        
        logger.debug(`Guest buttons state: ${state}`, 'SearchLifecycle');
    };

    /**
     * Set Initial State (Page Load)
     * AC-008A.1 to AC-008A.4
     * 
     * This method handles ALL UI state changes for initial state.
     * It's called both on page load and when "Reset" is clicked.
     */
    const setInitialState = () => {
        logger.debug('Setting Initial State', 'SearchLifecycle');
        currentState = 'initial';

        // AC-008A.1: Enable all input elements
        enableElement(elements.hotelSelect);
        enableElement(elements.checkinInput);
        enableElement(elements.checkoutInput);
        
        // AC-008A.2: Enable search button
        enableElement(elements.searchBtn);
        if (elements.searchBtn) {
            elements.searchBtn.textContent = 'busca vagas';
        }

        // Reset guest counter to default value (state-driven)
        if (elements.guestInput) {
            elements.guestInput.value = '2';
        }
        
        // Disable guest counter (FR-004A)
        GuestFilterStateManager.disable();
        setGuestButtonsState('initial');

        // AC-008A.3: Hide Reset button
        hideElement(elements.resetBtn);

        // AC-008A.4: Hide action buttons
        hideElement(elements.copyResultsBtn);
        hideElement(elements.clearResultsBtn);

        logger.debug('Initial State set - UI repainted', 'SearchLifecycle');
    };

    /**
     * Set Searching State (During Search)
     * AC-008A.5 to AC-008A.12
     */
    const setSearchingState = () => {
        logger.debug('Setting Searching State', 'SearchLifecycle');
        currentState = 'searching';

        // AC-008A.5 to AC-008A.8: Disable all inputs and guest controls
        disableElement(elements.hotelSelect);
        disableElement(elements.checkinInput);
        disableElement(elements.checkoutInput);
        disableElement(elements.guestPlusBtn);
        disableElement(elements.guestMinusBtn);

        // Set guest buttons to searching state
        setGuestButtonsState('searching');

        // AC-008A.9 & AC-008A.10: Disable search button and change text
        disableElement(elements.searchBtn);
        if (elements.searchBtn) {
            elements.searchBtn.textContent = '🔍 Buscando...';
        }

        // AC-008A.12: Visual indication applied via disableElement()
        
        logger.debug('Searching State set', 'SearchLifecycle');
    };

    /**
     * Set Results State (After Search Completion)
     * AC-008A.13 to AC-008A.21
     */
    const setResultsState = () => {
        logger.debug('Setting Results State', 'SearchLifecycle');
        currentState = 'results';

        // AC-008A.13 to AC-008A.15: Keep hotel and date inputs disabled
        disableElement(elements.hotelSelect);
        disableElement(elements.checkinInput);
        disableElement(elements.checkoutInput);

        // AC-008A.16: Enable guest counter (handled by GuestFilterStateManager)
        // Will be enabled by search completion in hotelSearch.js
        setGuestButtonsState('results');

        // AC-008A.17: Search button remains disabled
        disableElement(elements.searchBtn);

        // AC-008A.18: Show and enable Reset button
        showElement(elements.resetBtn);
        enableElement(elements.resetBtn);

        // AC-008A.19 & AC-008A.20: Show action buttons
        showElement(elements.copyResultsBtn);
        showElement(elements.clearResultsBtn);
        enableElement(elements.copyResultsBtn);
        enableElement(elements.clearResultsBtn);

        logger.debug('Results State set', 'SearchLifecycle');
    };

    /**
     * Handle Reset button click
     * AC-008A.26 to AC-008A.37
     * 
     * IMPORTANT: This method ONLY changes state to trigger UI repaint.
     * It does NOT manipulate data or DOM content directly.
     * The state change triggers stylistic updates through setInitialState().
     */
    const handleReset = () => {
        logger.debug('Starting New Search - State Change Only', 'SearchLifecycle');

        // Change state to initial - this triggers all UI updates
        setInitialState();
        
        // Clear results container visibility (stylistic change only)
        if (elements.resultsContainer) {
            elements.resultsContainer.classList.remove('visible');
        }
        
        // Clear results content (data cleanup delegated to state)
        if (elements.hotelsCardsContainer) {
            elements.hotelsCardsContainer.innerHTML = '';
        }

        logger.debug('State changed to initial - UI will repaint', 'SearchLifecycle');
    };

    /**
     * Get current state
     */
    const getCurrentState = () => currentState;

    /**
     * Initialize the state manager
     */
    const init = () => {
        logger.emoji('🔧', 'Initializing Search Lifecycle State Manager', 'FR-008A');
        
        // Get all DOM element references
        elements.hotelSelect = document.getElementById('hotel-select');
        elements.checkinInput = document.getElementById('input-checkin');
        elements.checkoutInput = document.getElementById('input-checkout');
        elements.guestPlusBtn = document.querySelector('.plus');
        elements.guestMinusBtn = document.querySelector('.minus');
        elements.guestInput = document.querySelector('.quantity');
        elements.searchBtn = document.getElementById('search-button');
        elements.resetBtn = document.getElementById('reset-btn');
        elements.copyResultsBtn = document.getElementById('copy-results-btn');
        elements.clearResultsBtn = document.getElementById('clear-results-btn');
        elements.resultsContainer = document.getElementById('results-container');
        elements.hotelsCardsContainer = document.getElementById('hotels-cards-container');

        // Set initial state
        setInitialState();
        
        // Setup Reset button handler
        if (elements.resetBtn) {
            elements.resetBtn.addEventListener('click', () => {
                handleReset();
            });
        }

        logger.emoji('✅', 'Search Lifecycle State Manager initialized', 'FR-008A');
    };

    // Return public API
    return {
        init,
        setInitialState,
        setSearchingState,
        setResultsState,
        handleReset,
        getCurrentState,
        enableElement,
        disableElement,
        showElement,
        hideElement,
        setGuestButtonsState
    };
}

// Create singleton instance
const SearchLifecycleState = createSearchLifecycleState();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        SearchLifecycleState.init();
    });
} else {
    SearchLifecycleState.init();
}

export { SearchLifecycleState };
